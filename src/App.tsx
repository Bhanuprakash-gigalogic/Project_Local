import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import AdminRoutes from './routes/admin.routes';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AdminRoutes />
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
