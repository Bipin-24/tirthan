import { promises as fs } from 'fs';
import path from 'path';
import Head from 'next/head';

export default function FeedbackViewer({ feedback }) {
  const helpful = feedback.filter(f => f.helpful);
  const notHelpful = feedback.filter(f => !f.helpful);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Head>
        <title>Feedback Viewer | Markdoc</title>
      </Head>
      
      <h1>Feedback Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ 
          flex: 1, 
          padding: '1.5rem', 
          background: '#f0fdf4', 
          borderRadius: '8px',
          border: '2px solid #10b981'
        }}>
          <h2 style={{ margin: 0, color: '#10b981' }}>👍 Helpful</h2>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>
            {helpful.length}
          </div>
        </div>
        
        <div style={{ 
          flex: 1, 
          padding: '1.5rem', 
          background: '#fef2f2', 
          borderRadius: '8px',
          border: '2px solid #ef4444'
        }}>
          <h2 style={{ margin: 0, color: '#ef4444' }}>👎 Not Helpful</h2>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ef4444' }}>
            {notHelpful.length}
          </div>
        </div>
        
        <div style={{ 
          flex: 1, 
          padding: '1.5rem', 
          background: '#f3f4f6', 
          borderRadius: '8px',
          border: '2px solid #6b7280'
        }}>
          <h2 style={{ margin: 0, color: '#6b7280' }}>📊 Total</h2>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#6b7280' }}>
            {feedback.length}
          </div>
        </div>
      </div>

      <h2>Recent Feedback</h2>
      
      {feedback.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No feedback yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[...feedback].reverse().map((item, index) => (
            <div 
              key={index}
              style={{
                padding: '1rem',
                background: item.helpful ? '#f0fdf4' : '#fef2f2',
                borderRadius: '8px',
                border: `2px solid ${item.helpful ? '#10b981' : '#ef4444'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <strong style={{ color: item.helpful ? '#10b981' : '#ef4444' }}>
                    {item.helpful ? '👍 Helpful' : '👎 Not Helpful'}
                  </strong>
                  <span style={{ marginLeft: '1rem', color: '#6b7280' }}>
                    {item.page}
                  </span>
                </div>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
              
              {item.comment && (
                <div style={{ 
                  padding: '0.75rem', 
                  background: 'white', 
                  borderRadius: '4px',
                  marginTop: '0.5rem'
                }}>
                  <strong>Comment:</strong> {item.comment}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  const dataDir = path.join(process.cwd(), 'data');
  const feedbackFile = path.join(dataDir, 'feedback.json');
  
  let feedback = [];
  
  try {
    const data = await fs.readFile(feedbackFile, 'utf8');
    feedback = JSON.parse(data);
  } catch (error) {
    // No feedback file yet, return empty array
    console.log('No feedback file found yet');
  }
  
  return {
    props: {
      feedback
    }
  };
}
