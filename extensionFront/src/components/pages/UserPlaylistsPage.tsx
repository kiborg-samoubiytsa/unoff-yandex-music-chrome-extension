import { UserPlaylists } from "../UserPages/UserPlaylists";
import { Sidebar } from "../Sidebar/Sidebar";
import { useSelectedItemReset } from "../../hooks/useSelectedItemReset";

export const UserPlaylistsPage = () => {
  useSelectedItemReset();
  return (
    <div className="User-Collection">
      <UserPlaylists />
      <Sidebar />
    </div>
  );
};
