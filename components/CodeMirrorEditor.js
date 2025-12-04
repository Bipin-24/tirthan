import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

function CodeMirrorEditor({ code, onChange, options, errors, cursor, forwardedRef }) {
  const [key, setKey] = React.useState(0);

  const codeMirrorOptions = React.useMemo(
    () => ({
      ...options,
      autofocus: Boolean(cursor),
      styleSelectedText: true,
      lineNumbers: true,
      theme: 'none',
      mode: 'markdoc',
      lineWrapping: true,
      screenReaderLabel: 'Markdoc sandbox'
    }),
    [options, cursor]
  );

  const onBeforeChange = React.useCallback(
    (editor, meta, code) => onChange(code),
    [onChange]
  );

  React.useEffect(() => {
    if (errors.length) {
      const markers = [];
      const editor = forwardedRef.current?.editor;

      if (editor) {
        errors.forEach((error) => {
          try {
            const from = {
              line: error.location?.start.line - 1,
              ch: error.location?.start.character
            };
            const to = {
              line: error.location?.end.line - 1,
              ch: error.location?.end.character
            };

            markers.push(
              editor.markText(from, to, {
                className: 'syntax-error',
                attributes: {
                  'data-title': error.error.message,
                  'aria-label': error.error.message
                }
              })
            );
          } catch (error) {
            console.error(error);
          }
        });
      }

      return () => markers.forEach((mark) => mark.clear());
    }
  }, [errors, forwardedRef]);

  React.useEffect(() => {
    require('codemirror/mode/markdown/markdown');
    require('codemirror/mode/javascript/javascript');
    require('codemirror/mode/xml/xml');
    require('codemirror/addon/selection/mark-selection');
    require('./codemirror/markdoc.js');
    setKey((k) => k + 1);
  }, []);

  return (
    <>
      <CodeMirror
        ref={forwardedRef}
        key={key}
        value={code}
        options={codeMirrorOptions}
        onBeforeChange={onBeforeChange}
        cursor={cursor}
      />
      <style jsx>
        {`
          :global(.syntax-error) {
            position: relative;
            text-decoration: red wavy underline;
            text-decoration-skip-ink: none;
          }

          /* Tooltip */
          :global(.syntax-error::before) {
            content: attr(data-title);
            position: absolute;
            display: none;
            color: var(--black);
            background: var(--white);
            bottom: 20px;
            padding: 1px 4px;
            border-radius: 4px;
            z-index: 999;
            min-width: 240px;
          }

          /* Tooltip triangle */
          :global(.syntax-error::after) {
            content: '';
            position: absolute;
            display: none;
            bottom: 12px;
            left: 12px;
            border-width: 4px;
            border-style: solid;
            border-color: var(--white) transparent transparent transparent;
          }

          :global(.syntax-error:hover::before),
          :global(.syntax-error:hover::after) {
            display: inline-block;
          }
        `}
      </style>
    </>
  );
}

export default CodeMirrorEditor;
