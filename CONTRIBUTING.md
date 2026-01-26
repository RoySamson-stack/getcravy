# Contributing to GoEat

Thank you for your interest in contributing to GoEat! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/getcravy/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Device/OS information

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Mockups/wireframes if applicable

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/getcravy.git
   cd getcravy
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Write or update tests
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug in authentication"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for tests
   - `chore:` for maintenance

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Fill out the PR template
   - Link related issues
   - Request review from maintainers

## Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Avoid `any` types - use proper types or `unknown`
- Use interfaces for object shapes
- Use enums for constants

### React/React Native

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use meaningful component and variable names

### File Naming

- Components: `PascalCase.tsx` (e.g., `HomeScreen.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Constants: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

### Code Formatting

- Use Prettier for formatting
- Run `npm run format` before committing
- Maximum line length: 100 characters
- Use 2 spaces for indentation

### Comments

- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for functions and components
- Keep comments up-to-date

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >70% code coverage
- Test on both iOS and Android when possible

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update API documentation if endpoints change
- Keep CHANGELOG.md updated

## Review Process

1. All PRs require at least one approval
2. CI checks must pass
3. Code review feedback should be addressed
4. Maintainers will merge when ready

## Questions?

- Open an issue for questions
- Check existing documentation
- Ask in discussions

Thank you for contributing! 🎉








