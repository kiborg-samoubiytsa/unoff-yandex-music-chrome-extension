import { UserPodcasts } from "../UserPages/UserPodcasts";
import { Sidebar } from "../Sidebar/Sidebar";
import { useSelectedItemReset } from "../../hooks/useSelectedItemReset";

export const UserPodcastsPage = () => {
  useSelectedItemReset();
  return (
    <div className="User-Collection">
      <UserPodcasts />
      <Sidebar />
    </div>
  );
};
