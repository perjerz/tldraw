import Head from 'next/head'
import { signIn, signOut, getSession, useSession } from 'next-auth/client'
import { GetServerSidePropsContext } from 'next'

export default function Home({
  ssrSession,
  isOwner,
  isSponsor,
}: {
  isOwner: boolean
  isSponsor: boolean
  ssrSession: any
}) {
  const [session, loading] = useSession()
  return (
    <>
      <Head>
        <title>tldraw</title>
      </Head>
      <div>
        <button onClick={() => signIn()}>Sign In</button>
        <button onClick={() => signOut()}>Sign Out</button>
        <p>{loading && 'Loading...'}</p>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <p>Is owner? {isOwner.toString()}</p>
        <p>Is sponsor? {isSponsor.toString()}</p>

        {isSponsor ? (
          <p>
            <b>Hey, thanks for sponsoring me!</b>
          </p>
        ) : (
          <p>
            <b>
              This site is just for my github sponsors.{' '}
              <a
                href="https://github.com/sponsors/steveruizok"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sponsor here!
              </a>
            </b>
          </p>
        )}
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const image = session?.user?.image

  const sponsors = await fetch(
    'https://sponsors.trnck.dev/sponsors/steveruizok'
  ).then((d) => d.json().then((d) => d.sponsors))

  const sponsor = sponsors.some((sponsor: any) => sponsor.avatar === image)

  console.log(
    session?.user,
    image,
    sponsors.map((sponsor: any) => sponsor.avatar)
  )

  return {
    props: {
      isOwner: session?.user?.email === 'steveruizok@gmail.com',
      isSponsor: sponsor,
      ssrSession: session,
    },
  }
}