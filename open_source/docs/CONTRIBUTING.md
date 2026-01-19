# Contributing Guide

Thank you for your interest in contributing to the AI Chat Interface! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Ways to Contribute

1. **Report Bugs** - Found a bug? Let us know!
2. **Suggest Features** - Have ideas for improvements?
3. **Submit Code** - Fix bugs or implement features
4. **Improve Documentation** - Help others understand the project
5. **Review Pull Requests** - Share your expertise

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
git
```

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-chat-interface.git
   cd ai-chat-interface
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/ai-chat-interface.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Workflow

### 1. Before You Code

- **Check existing issues** - Someone might already be working on it
- **Discuss large changes** - Open an issue first for major features
- **Read the code** - Familiarize yourself with the codebase

### 2. While Coding

```bash
# Run development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check
```

### 3. Code Quality Standards

#### TypeScript

```tsx
// ✅ Good
interface UserProps {
  name: string;
  age: number;
}

export const User: React.FC<UserProps> = ({ name, age }) => {
  return <div>{name} ({age})</div>;
};

// ❌ Bad
export const User = (props: any) => {
  return <div>{props.name} ({props.age})</div>;
};
```

#### Component Structure

```tsx
/**
 * Component Description
 * 
 * @component
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */

// 1. Imports
import React, { useState, useCallback } from 'react';
import { Button } from './Button';

// 2. Types
interface ComponentProps {
  value: string;
  onChange: (value: string) => void;
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({
  value,
  onChange,
}) => {
  // 3a. State & Hooks
  const [localState, setLocalState] = useState('');
  
  // 3b. Handlers
  const handleClick = useCallback(() => {
    onChange(value);
  }, [value, onChange]);
  
  // 3c. Render
  return (
    <div>
      <Button onClick={handleClick}>{value}</Button>
    </div>
  );
};

// 4. Display Name
Component.displayName = 'Component';

// 5. Export
export default Component;
```

#### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ChatInput` |
| Functions | camelCase | `handleSubmit` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| Files (Components) | PascalCase.tsx | `ChatInput.tsx` |
| Files (Utils) | camelCase.ts | `helpers.ts` |
| Interfaces | I + PascalCase | `IUserMessage` |
| Types | PascalCase | `MessageType` |
| CSS Classes | kebab-case | `chat-input` |

#### Comments

```tsx
/**
 * JSDoc for functions and components
 * 
 * @param value - Description
 * @returns Description
 * 
 * @example
 * ```tsx
 * const result = myFunction('test');
 * ```
 */
export function myFunction(value: string): string {
  // Inline comments for complex logic
  const processed = complexOperation(value);
  
  return processed;
}
```

### 4. Testing

```tsx
// Component Test
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  it('should render correctly', () => {
    render(<ChatInput onSubmit={jest.fn()} />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  
  it('should call onSubmit when Enter is pressed', () => {
    const onSubmit = jest.fn();
    render(<ChatInput onSubmit={onSubmit} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onSubmit).toHaveBeenCalledWith('Hello', []);
  });
});

// Hook Test
import { renderHook, act } from '@testing-library/react';
import { useFileUpload } from './useFileUpload';

describe('useFileUpload', () => {
  it('should upload files', async () => {
    const { result } = renderHook(() => useFileUpload());
    
    const mockFile = new File(['content'], 'test.txt', {
      type: 'text/plain',
    });
    
    await act(async () => {
      await result.current.uploadFiles([mockFile]);
    });
    
    expect(result.current.uploadedFiles).toHaveLength(1);
  });
});
```

### 5. Committing

We use **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, missing semi-colons, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples

```bash
# Feature
git commit -m "feat(chat): add file upload support"

# Bug fix
git commit -m "fix(streaming): handle connection errors properly"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api): change message format

BREAKING CHANGE: Message structure has been updated.
Messages now require 'id' field."
```

### 6. Submitting a Pull Request

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in the template
   - Link related issues

#### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated

## Screenshots (if applicable)

## Related Issues
Fixes #123
```

## 🎨 Style Guide

### React Best Practices

1. **Use Functional Components**
   ```tsx
   // ✅ Good
   const Component: React.FC = () => { ... };
   
   // ❌ Bad
   class Component extends React.Component { ... }
   ```

2. **Use Hooks Correctly**
   ```tsx
   // ✅ Good
   const [value, setValue] = useState('');
   
   useEffect(() => {
     // Effect logic
     return () => {
       // Cleanup
     };
   }, [dependencies]);
   
   // ❌ Bad
   useEffect(() => {
     // No dependencies specified
   });
   ```

3. **Memoize When Needed**
   ```tsx
   // ✅ Good
   const memoizedValue = useMemo(() => expensive(a, b), [a, b]);
   const memoizedCallback = useCallback(() => doSomething(a), [a]);
   
   // ❌ Bad
   const value = expensive(a, b); // Recalculates every render
   ```

4. **Handle Loading & Error States**
   ```tsx
   // ✅ Good
   if (loading) return <Loading />;
   if (error) return <Error message={error.message} />;
   return <Content data={data} />;
   ```

### Accessibility

1. **Use Semantic HTML**
   ```tsx
   // ✅ Good
   <button onClick={handleClick}>Click me</button>
   <nav aria-label="Main navigation">...</nav>
   
   // ❌ Bad
   <div onClick={handleClick}>Click me</div>
   <div className="nav">...</div>
   ```

2. **Add ARIA Labels**
   ```tsx
   <input aria-label="Search messages" />
   <button aria-label="Send message">
     <SendIcon />
   </button>
   ```

3. **Support Keyboard Navigation**
   ```tsx
   <div
     role="button"
     tabIndex={0}
     onClick={handleClick}
     onKeyDown={(e) => e.key === 'Enter' && handleClick()}
   >
     Action
   </div>
   ```

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Testing Library](https://testing-library.com)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Semantic Versioning](https://semver.org)

## ❓ Questions?

- **GitHub Discussions** - Ask questions, share ideas
- **Issues** - Report bugs, request features
- **Discord** - Real-time chat (if available)
- **Email** - contact@project.com

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report violations to: conduct@project.com

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

Thank you for contributing! 🙏

---

**Last Updated**: January 2026
