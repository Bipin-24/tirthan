import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Feedback() {
  const router = useRouter();
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (isHelpful) => {
    setFeedback(isHelpful);
    
    if (isHelpful) {
      // If helpful, submit immediately without comment
      await submitFeedback(isHelpful, '');
    } else {
      // If not helpful, show comment box
      setShowComment(true);
    }
  };

  const submitFeedback = async (isHelpful, userComment) => {
    setIsSubmitting(true);
    
    const feedbackData = {
      helpful: isHelpful,
      comment: userComment,
      page: router.asPath,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : ''
    };

    try {
      // Send to your API endpoint
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        console.log('Feedback submitted successfully:', feedbackData);
        setSubmitted(true);
      } else {
        console.error('Failed to submit feedback');
        // Still show success to user
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Log locally as fallback
      console.log('Feedback (logged locally):', feedbackData);
      // Still show success to user
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    submitFeedback(feedback, comment);
  };

  if (submitted) {
    return (
      <div className="feedback-container">
        <div className="feedback-success">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div className="success-title">Thank you!</div>
            <div className="success-message">Your feedback helps us improve.</div>
          </div>
        </div>
        <style jsx>{`
          .feedback-container {
            margin: 1.5rem 0 2rem 2rem;
            padding: 0.5rem 0.75rem;
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            max-width: 500px;
          }
          
          .feedback-success {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #10b981;
          }

          .feedback-success svg {
            flex-shrink: 0;
            width: 22px;
            height: 22px;
          }

          .success-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 2px;
            color: #10b981;
          }

          .success-message {
            font-size: 13px;
            color: #6b7280;
            font-weight: 500;
            line-height: 1.3;
          }

          @media (max-width: 900px) {
            .feedback-container {
              margin: 2rem 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-question">
        <span>Was this page helpful?</span>
        <div className="feedback-buttons">
          <button 
            onClick={() => handleFeedback(true)}
            className={feedback === true ? 'active' : ''}
            aria-label="Yes, this page was helpful"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M1 8.5h4l3-7 3 7h8l-6.5 4.7 2.5 7.3L8.5 15 2 20l2.5-7.3L1 8.5z" fill="currentColor"/>
            </svg>
            Yes
          </button>
          <button 
            onClick={() => handleFeedback(false)}
            className={feedback === false ? 'active' : ''}
            aria-label="No, this page was not helpful"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19 11.5h-4l-3 7-3-7H1l6.5-4.7L5 1.2 11.5 5 18 0l-2.5 7.3L19 11.5z" fill="currentColor"/>
            </svg>
            No
          </button>
        </div>
      </div>

      {showComment && (
        <div className="feedback-form">
          <textarea
            placeholder="Tell us how we can improve this page..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />
          <button 
            onClick={handleSubmit} 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit feedback'}
          </button>
        </div>
      )}

      <style jsx>{`
        .feedback-container {
          margin: 1.5rem 0 2rem 2rem;
          padding: 0.5rem 0.75rem;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          max-width: 500px;
        }

        .feedback-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .feedback-question span {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          letter-spacing: -0.01em;
        }

        .feedback-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .feedback-buttons button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: #ffffff;
          color: #4b5563;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .feedback-buttons button:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .feedback-buttons button.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .feedback-buttons button svg {
          width: 18px;
          height: 18px;
        }

        .feedback-buttons button svg {
          width: 16px;
          height: 16px;
        }

        .feedback-form {
          margin-top: 0.75rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .feedback-form textarea {
          flex: 1;
          padding: 10px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-family: var(--sans);
          font-size: 13px;
          line-height: 1.4;
          resize: vertical;
          background: #ffffff;
          color: #1f2937;
          min-height: 44px;
          max-height: 70px;
        }

        .feedback-form textarea::placeholder {
          color: #9ca3af;
        }

        .feedback-form textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .submit-btn {
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          align-self: stretch;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .feedback-container {
            margin: 2rem 0;
          }

          .feedback-question {
            flex-direction: column;
            align-items: flex-start;
          }

          .feedback-buttons {
            width: 100%;
          }

          .feedback-buttons button {
            flex: 1;
          }

          .feedback-form {
            flex-direction: column;
          }

          .submit-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
