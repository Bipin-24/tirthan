// Simple chat API endpoint
// You can replace this with your actual AI/backend integration

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, id, page } = req.body;
    
    // Log the chat message
    console.log('💬 Chat message:', {
      sessionId: id,
      page,
      question,
      timestamp: new Date().toISOString()
    });

    // Simple response mapping for common questions
    const responses = {
      'what is markdoc?': 'Markdoc is a powerful, flexible, Markdown-based authoring framework. It extends Markdown with custom tags and nodes, making it perfect for creating documentation. Check out our [overview](/docs/overview) to learn more!',
      
      'how do i get started?': 'Getting started with Markdoc is easy! First, install it via npm:\n\n`npm install @markdoc/markdoc`\n\nThen check out our [getting started guide](/docs/getting-started) for detailed setup instructions.',
      
      'show me examples': 'We have several examples showing Markdoc in action:\n\n- [Using with HTML](/docs/examples/html)\n- [Using with React](/docs/examples/react)\n- [Using with Next.js](/docs/nextjs)\n\nVisit our [examples section](/docs/examples) for more!',
      
      'syntax guide': 'Markdoc uses Markdown syntax with powerful extensions. Key features include:\n\n- **Tags**: Custom components like `{% callout %}`\n- **Nodes**: Extended Markdown nodes\n- **Variables**: Dynamic content with `$variable`\n- **Functions**: Built-in helpers\n\nLearn more in our [syntax guide](/docs/syntax).',
    };

    // Find matching response (case-insensitive)
    const lowerQuestion = question.toLowerCase().trim();
    let answer = responses[lowerQuestion];

    // If no exact match, provide a helpful default
    if (!answer) {
      if (lowerQuestion.includes('tag')) {
        answer = 'Tags are one of Markdoc\'s most powerful features! They let you extend Markdown with custom components. Learn about [tags in our documentation](/docs/tags).';
      } else if (lowerQuestion.includes('node')) {
        answer = 'Nodes in Markdoc extend the standard Markdown elements. Check out our [nodes documentation](/docs/nodes) to learn how to customize them.';
      } else if (lowerQuestion.includes('install')) {
        answer = 'To install Markdoc, run:\n\n`npm install @markdoc/markdoc`\n\nSee our [installation guide](/docs/getting-started) for more details.';
      } else if (lowerQuestion.includes('next')) {
        answer = 'To use Markdoc with Next.js, check out our [Next.js integration guide](/docs/nextjs). We also have an npm package: `@markdoc/next.js`';
      } else {
        answer = `Thanks for your question! While I'm a simple demo chatbot, you can find detailed information in our documentation:\n\n- [Overview](/docs/overview)\n- [Getting Started](/docs/getting-started)\n- [Core Concepts](/docs/syntax)\n\nOr try asking about specific topics like "tags", "nodes", or "installation".`;
      }
    }

    // Return the response
    return res.status(200).json({
      success: true,
      answer,
      sessionId: id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      details: error.message
    });
  }
}
