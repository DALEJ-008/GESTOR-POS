# Copilot Instructions for Gestor POS

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a multi-tenant inventory and sales management system (POS) built with:
- **Backend**: Django 4.2.7 with django-tenant-schemas for multi-tenancy
- **Frontend**: React 18 with TypeScript, Vite, Ant Design, and Tailwind CSS
- **Database**: MySQL with Redis for caching and Celery for background tasks
- **Authentication**: JWT with django-rest-framework-simplejwt

## Architecture Guidelines

### Multi-Tenancy
- Each company (tenant) has its own isolated data schema
- Use `tenant_schemas` for database isolation
- Always consider tenant context when writing code
- Shared apps: `tenants`, common configurations
- Tenant-specific apps: `authentication`, `products`, `inventory`, `sales`, etc.

### Backend (Django)
- Follow Django REST Framework patterns
- Use class-based views when possible
- Implement proper serializers for all models
- Add pagination to list views
- Include proper error handling and validation
- Use Django's permission system with custom permissions
- Follow the tenant-aware model pattern

### Frontend (React + TypeScript)
- Use TypeScript for all components and utilities
- Follow React functional components with hooks
- Use Zustand for state management
- Implement proper error boundaries
- Use Ant Design components consistently
- Apply Tailwind CSS for custom styling
- Use React Query for API data fetching and caching
- Implement responsive design patterns

### Code Style
- Use ES6+ features
- Prefer const over let, avoid var
- Use descriptive variable and function names in Spanish for business logic
- Add JSDoc comments for complex functions
- Follow REST API conventions
- Use proper HTTP status codes
- Implement proper loading and error states

### Security
- Always validate input data
- Use CSRF protection
- Implement proper authentication checks
- Sanitize user inputs
- Use environment variables for sensitive data
- Follow JWT best practices

### Database
- Use Django migrations for schema changes
- Add proper indexes for performance
- Use foreign keys and relationships appropriately
- Consider tenant isolation in all queries
- Use soft deletes where appropriate

### API Design
- Follow REST conventions
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Implement consistent response formats
- Add API versioning when needed
- Use proper status codes
- Include metadata in responses (pagination, counts)

### Testing
- Write unit tests for models and utilities
- Add integration tests for APIs
- Test tenant isolation thoroughly
- Include edge cases in tests

## Business Logic Notes
- Products can have variants (size, color, etc.)
- Inventory tracks stock levels and movements
- Sales support multiple payment methods
- Reports are generated based on tenant data
- Users have role-based permissions within each tenant
- Support for barcode scanning and printing
- Multi-currency and multi-language support
- Dashboard shows key business metrics

## File Structure
```
backend/
├── gestor_pos/          # Django project settings
├── tenants/             # Multi-tenant management
├── authentication/      # User authentication and permissions
├── products/            # Product catalog
├── inventory/           # Stock management
├── sales/              # Sales and POS
├── customers/          # Customer management
├── suppliers/          # Supplier management
├── reports/            # Business reports
└── configuration/      # System settings

frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── layouts/        # Layout components
│   ├── store/          # Zustand stores
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── services/       # API service functions
```

## Common Patterns

### Django Model Pattern
```python
class MyModel(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado en")
    
    class Meta:
        verbose_name = "Mi Modelo"
        verbose_name_plural = "Mis Modelos"
    
    def __str__(self):
        return self.name
```

### React Component Pattern
```tsx
interface Props {
  title: string;
  onSave: (data: FormData) => void;
}

const MyComponent: React.FC<Props> = ({ title, onSave }) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

Remember to always consider the multi-tenant architecture and ensure proper isolation between different companies' data.
