import { Sidebar } from "@/components/layout/Sidebar";
import { MainCanvas } from "@/components/layout/MainCanvas";
import { Chat } from "@/components/chat/Chat";

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <MainCanvas>
        <Chat />
      </MainCanvas>
    </div>
  );
}

export default App;
