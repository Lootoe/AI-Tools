import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { HomePage } from '@/pages/HomePage';
import { ChatPage } from '@/pages/ChatPage';
import { WorkflowPage } from '@/pages/WorkflowPage';
import { TextToImagePage } from '@/pages/TextToImagePage';
import { ImageToVideoPage } from '@/pages/ImageToVideoPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <main className="flex-1 container mx-auto px-4 py-8 overflow-auto">
                <HomePage />
              </main>
            } />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/workflow" element={
              <main className="flex-1 container mx-auto px-4 py-8 overflow-auto">
                <WorkflowPage />
              </main>
            } />
            <Route path="/text-to-image" element={
              <main className="flex-1 container mx-auto px-4 py-8 overflow-auto">
                <TextToImagePage />
              </main>
            } />
            <Route path="/image-to-video" element={
              <main className="flex-1 container mx-auto px-4 py-8 overflow-auto">
                <ImageToVideoPage />
              </main>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
