import { currentProfile } from "@/lib/current-profile";

const ServerIDPage = async () => {
  //Remove async
  const profile = await currentProfile(); //Remove
  if (profile)
    return (
      <div>
        Server ID Page
        <br /> {/*//Remove*/}
        {profile.name}
        {/*//Remove*/}
      </div>
    );
};

export default ServerIDPage;
