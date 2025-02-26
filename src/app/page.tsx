import { Button } from "@heroui/button";
import { FaRegSmile } from "react-icons/fa";
import { auth, signOut } from "@/auth";
import PageContainer from "@/components/page-container";

export default async function Home() {
  const session = await auth()
  return (
    <PageContainer>
      <h1>user session data:</h1>
      {session ? (
        <div>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <form action={async () => {
            'use server'
            await signOut()
          }}>
            <Button color="primary" variant="bordered" startContent={<FaRegSmile />} type='submit'>Sign Out</Button>
          </form>
        </div>
      ) : (
        <div>Not signed in</div>
      )}
    </PageContainer>
  );
}
