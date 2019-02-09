import React, { useState, useEffect } from 'react';
import Binding from './Binding';

function ShareDBBinding(props) {
  const { doc } = props;

  let [text, setText] = useState('');
  let binding;

  useEffect(() => {
    doc.subscribe(err => {
      if (err) {
        props.handleError('There was an error subscribing.');
      }
    });

    // Load document and bind it to local snapshot.
    doc.on('load', () => {
      try {
        binding = new Binding(doc.data, '≈');
        setText(binding.snapshot.slice(-300) || binding.snapshot || '');
      } catch (err) {
        props.handleError('There was an error loading.');
      }
    });

    // Apply remote ops to local snapshot.
    doc.on('op', op => {
      setTimeout(() => {
        setText(binding.applyOp(op));
      }, 0);
    });

    // Destroy listeners.
    return () => {
      doc.unsubscribe();
      doc.destroy();
      binding = null;
    };
  }, []);

  return (
    <div className="preview-box">
      { text.slice(-300) || text }
    </div>
  );
}

export default ShareDBBinding;
