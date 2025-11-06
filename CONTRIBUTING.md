# Contributing to SmartXerox

Thank you for considering contributing to SmartXerox! 🎉

## How to Contribute

### Reporting Bugs

Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, browser)

### Suggesting Features

Have an idea? Create an issue with:
- Feature description
- Use case / problem it solves
- Proposed implementation (optional)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

## Code Style

- Use ES6+ features
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

## Testing

Before submitting:
- [ ] Test student order creation
- [ ] Test order tracking
- [ ] Test admin login
- [ ] Test status updates
- [ ] Test file downloads
- [ ] Test on mobile devices
- [ ] Check console for errors

## Project Structure

```
SmartXerox/
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/      # Main pages
│   │   ├── components/ # Reusable components
│   │   └── services/   # API calls
├── server/          # Node.js backend
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, validation
│   ├── services/       # Supabase client
│   └── cron/          # Scheduled jobs
└── database/        # SQL schemas
```

## Need Help?

- Check [README.md](./README.md) for overview
- See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for setup
- Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
