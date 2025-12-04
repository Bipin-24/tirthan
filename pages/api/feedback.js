import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const feedbackData = req.body;
    
    // Add server timestamp
    feedbackData.receivedAt = new Date().toISOString();
    
    // Define the path to store feedback (in a data directory)
    const dataDir = path.join(process.cwd(), 'data');
    const feedbackFile = path.join(dataDir, 'feedback.json');
    
    // Ensure data directory exists
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
    
    // Read existing feedback or create new array
    let allFeedback = [];
    try {
      const existingData = await fs.readFile(feedbackFile, 'utf8');
      allFeedback = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      allFeedback = [];
    }
    
    // Add new feedback
    allFeedback.push(feedbackData);
    
    // Write back to file
    await fs.writeFile(feedbackFile, JSON.stringify(allFeedback, null, 2), 'utf8');
    
    // Log to console for immediate visibility
    console.log('📝 New feedback received:', {
      page: feedbackData.page,
      helpful: feedbackData.helpful,
      comment: feedbackData.comment || '(no comment)',
      timestamp: feedbackData.timestamp
    });
    
    // Return success
    return res.status(200).json({ 
      success: true, 
      message: 'Feedback received successfully' 
    });
    
  } catch (error) {
    console.error('Error saving feedback:', error);
    return res.status(500).json({ 
      error: 'Failed to save feedback',
      details: error.message 
    });
  }
}
