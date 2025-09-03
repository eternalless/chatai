import { ApolloClient, InMemoryCache, gql,HttpLink } from '@apollo/client';
import './App.css'
import ChatBox from './pages/ChatBox';
// 必须显式创建 HttpLink
const httpLink = new HttpLink({
  uri: '/graphql', // 你的后端地址
});
// 创建 Apollo 客户端
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
function App() {
  // 调用 generateText 查询（Query）
const generateText = async (prompt: string, maxTokens: number) => {
  const response:any = await client.query({
    query: gql`
      query GenerateText($prompt: String!, $maxTokens: Float) {
        generateText(prompt: $prompt, maxTokens: $maxTokens)
      }
    `,
    variables: { prompt, maxTokens }
  });
  return response.data.generateText;
}
  // 模拟API调用
  const mockApiCall = async (message: string): Promise<string> => {
    // 模拟网络延迟
    // await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    const res = await generateText(message, 100)
    console.log(res);
    // 模拟不同类型的回复

    return res;
  };
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      minHeight: '84vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        AI聊天助手
      </h1>
      <ChatBox 
        onSendMessage={mockApiCall}
        placeholder="输入您的问题，按回车发送..."
        maxHeight="70vh"
      />
    </div>
  )
}

export default App
