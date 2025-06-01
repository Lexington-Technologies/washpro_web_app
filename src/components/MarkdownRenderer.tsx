"use client";

// Removed: import "@assistant-ui/react-markdown/styles/dot.css";
// We might need to add custom styles for react-markdown if default is not sufficient

import ReactMarkdown, { Options } from 'react-markdown'; // Main import
import remarkGfm from "remark-gfm";
import React, { FC, memo, ReactNode } from "react";
import { Box, Typography, Paper, Link, Divider, Table, TableHead, TableBody, TableRow, TableCell, Theme } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// Props passed by react-markdown that we might not use directly in MUI components
interface DefaultReactMarkdownProps {
  node?: any;
  children?: ReactNode;
  [key: string]: any; // Allow other props from react-markdown
}

// Helper to extract valid HTML props, filtering out react-markdown specific ones if not needed by the target MUI component
const getValidHTMLProps = (props: DefaultReactMarkdownProps) => {
  const { node, inline, ordered, checked, isHeader, ...htmlProps } = props;
  return htmlProps;
};

// Types for react-markdown components are slightly different
// We will define our components directly
const muiComponents: Options['components'] = {
  h1: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <Typography variant="h1" component="h1" gutterBottom sx={{my: 4, fontWeight: 'bold'}} {...getValidHTMLProps(props)}>{children}</Typography>
  ),
  h2: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <Typography variant="h2" component="h2" gutterBottom sx={{my: 3, fontWeight: 'bold'}} {...getValidHTMLProps(props)}>{children}</Typography>
  ),
  h3: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <Typography variant="h3" component="h3" gutterBottom sx={{my: 2, fontWeight: 'semibold'}} {...getValidHTMLProps(props)}>{children}</Typography>
  ),
  h4: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <Typography variant="h4" component="h4" gutterBottom sx={{my: 2, fontWeight: 'semibold'}} {...getValidHTMLProps(props)}>{children}</Typography>
  ),
  h5: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <Typography variant="h5" component="h5" gutterBottom sx={{my: 1, fontWeight: 'medium'}} {...getValidHTMLProps(props)}>{children}</Typography>
  ),
  h6: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <Typography variant="h6" component="h6" gutterBottom sx={{my: 1, fontWeight: 'medium'}} {...getValidHTMLProps(props)}>{children}</Typography>
  ),
  p: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <Typography variant="body1" component="p" paragraph sx={{lineHeight: 1.7}} {...getValidHTMLProps(props)}>{children}</Typography>
  ),
  a: ({ node, children, href, ...props }: DefaultReactMarkdownProps) => (
    <Link href={href} target="_blank" rel="noopener noreferrer" sx={{fontWeight: 'medium'}} {...getValidHTMLProps(props)}>{children}</Link>
  ),
  blockquote: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <Box
      component="blockquote"
      sx={(theme: Theme) => ({
        borderLeft: `4px solid ${theme.palette.divider}`,
        pl: 2,
        my: 2,
        fontStyle: 'italic',
        color: theme.palette.text.secondary,
      })}
      {...getValidHTMLProps(props)}
    >
      {children}
    </Box>
  ),
  ul: ({ node, ordered, className, children, ...props }: DefaultReactMarkdownProps) => (
    <Box component="ul" className={className} sx={{ my: 1, ml: 3, pl: 2, listStyleType: 'disc', '& li': { display: 'list-item', mb: 0.5, listStylePosition: 'outside'} }} {...getValidHTMLProps(props)}>{children}</Box>
  ),
  ol: ({ node, ordered, className, children, ...props }: DefaultReactMarkdownProps) => (
    <Box component="ol" className={className} sx={{ my: 1, ml: 3, pl: 2, listStyleType: 'decimal', '& li': { display: 'list-item', mb: 0.5, listStylePosition: 'outside' } }} {...getValidHTMLProps(props)}>{children}</Box>
  ),
  li: ({ node, ordered, checked, className, children, ...props }: DefaultReactMarkdownProps) => (
    <Typography component="li" className={className} sx={{p:0, display: 'list-item' }} {...getValidHTMLProps(props)}>{children}</Typography>
  ),
  hr: ({ node, ...props }: DefaultReactMarkdownProps) => (
    <Divider sx={{ my: 3 }} {...getValidHTMLProps(props)} />
  ),
  table: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <Paper elevation={0} sx={{ my: 2, border: (theme: Theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }} {...getValidHTMLProps(props)}>
      <Table component="table" size="small">{children}</Table> {/* Props for Table itself usually not needed from markdown */} 
    </Paper>
  ),
  thead: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <TableHead component="thead" sx={{backgroundColor: (theme: Theme) => alpha(theme.palette.action.hover || 'rgba(0, 0, 0, 0.04)', 0.05)}} {...getValidHTMLProps(props)}>{children}</TableHead>
  ),
  tbody: ({ node, children, ...props }: DefaultReactMarkdownProps) => (
    <TableBody component="tbody" {...getValidHTMLProps(props)}>{children}</TableBody>
  ),
  tr: ({ node, isHeader, children, ...props }: DefaultReactMarkdownProps) => (
    <TableRow component="tr" {...getValidHTMLProps(props)}>{children}</TableRow>
  ),
  th: ({ node, isHeader, children, ...props }: DefaultReactMarkdownProps) => (
    <TableCell component="th" sx={{ fontWeight: 'bold' }} {...getValidHTMLProps(props)}>{children}</TableCell>
  ),
  td: ({ node, isHeader, children, ...props }: DefaultReactMarkdownProps) => (
    <TableCell component="td" {...getValidHTMLProps(props)}>{children}</TableCell>
  ),
  code: ({ node, inline, className, children, ...props }: DefaultReactMarkdownProps) => {
    const theme = useTheme();
    const match = /language-(\w+)/.exec(className || '');
    const codeProps = getValidHTMLProps(props); // Get filtered props for the <code> or <pre> element

    if (!inline && match) {
      // Block code with language
      return (
        <Paper
          elevation={0}
          sx={{
            my: 2,
            backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.black, 0.3) : alpha(theme.palette.grey[200], 0.5),
            borderRadius: theme.shape.borderRadius,
            overflowX: 'auto',
          }}
        >
          <Box sx={{ 
              px: 1.5, 
              py: 0.5, 
              borderBottom: `1px solid ${theme.palette.divider}`, 
              color: theme.palette.text.secondary, 
              fontSize: '0.75rem',
              fontFamily: 'monospace'
            }}>
              {match[1]}
            </Box>
          <Box 
            component="pre" 
            sx={{ 
              m:0, 
              p: 1.5, 
              fontSize: '0.875rem', 
              fontFamily: 'monospace', 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-all'
            }}
            {...codeProps} // Spread filtered props to pre
          >
            <code className={className}>
              {String(children).replace(/\n$/, '')}
            </code>
          </Box>
        </Paper>
      );
    } else if (!inline) {
      // Block code without language or pre-formatted text not in a language block
       return (
        <Paper elevation={0} sx={{my: 2, overflowX: 'auto', backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.black, 0.2) : alpha(theme.palette.grey[100],0.7)}}>
            <Box component="pre" sx={{m:0, p:1.5, fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}} {...codeProps}>
                {String(children).replace(/\n$/, '')}
            </Box>
        </Paper>
       );
    }

    // Inline code
    return (
      <Box
        component="code"
        // className prop for inline code might not be needed if styling is fully via sx
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
          borderRadius: '4px',
          px: 0.5,
          py: 0.25,
          fontSize: '0.85em',
          fontFamily: 'monospace',
        }}
        {...codeProps} // Spread filtered props to inline code Box
      >
        {String(children)}
      </Box>
    );
  },
};

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRendererImpl: FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={muiComponents}
    >
      {content}
    </ReactMarkdown>
  );
};

export const MarkdownRenderer = memo(MarkdownRendererImpl); 