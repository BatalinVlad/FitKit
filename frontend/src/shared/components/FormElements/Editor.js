import React, { useState } from 'react';
import ReactQuill from 'react-quill';

const MyEditor = () => {
  const [editorValue, setEditorValue] = useState('');

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  const validateEditorValue = () => {
    if (editorValue.length < 100) {
      // Perform validation logic here, such as showing an error message
      console.log('Minimum length requirement not met');
    }
  };

  const initialValue = 'This is my initial value.';

  return (
    <ReactQuill
      value={editorValue}
      onChange={handleEditorChange}
      onBlur={validateEditorValue}
      placeholder="Enter your diet plan..."
      defaultValue={initialValue}
    />
  );
};

export default MyEditor;
