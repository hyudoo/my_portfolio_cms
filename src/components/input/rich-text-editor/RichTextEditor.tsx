'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  Essentials,
  Heading,
  HorizontalLine,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  Paragraph,
  Strikethrough,
  Underline,
  Undo,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import './rich-text-editor.css';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function RichTextEditor({ value, onChange, placeholder, disabled }: Props) {
  return (
    <div className="rich-text-editor">
      <CKEditor
        editor={ClassicEditor}
        config={{
          plugins: [
            Essentials,
            Undo,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Code,
            Heading,
            Paragraph,
            Link,
            List,
            BlockQuote,
            HorizontalLine,
            Indent,
            IndentBlock,
          ],
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'code',
              '|',
              'link',
              'bulletedList',
              'numberedList',
              'blockQuote',
              'horizontalLine',
              '|',
              'outdent',
              'indent',
              '|',
              'undo',
              'redo',
            ],
          },
          placeholder,
          link: {
            addTargetToExternalLinks: true,
          },
        }}
        data={value}
        disabled={disabled}
        onChange={(_event, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}
