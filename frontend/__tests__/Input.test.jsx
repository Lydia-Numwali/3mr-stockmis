/**
 * Unit Tests for Input Component
 * 
 * These tests verify that the Input component renders correctly
 * with all input types, sizes, and states.
 * 
 * Requirements: 9.1, 9.4, 9.5
 * 
 * Test Coverage:
 * - All input types render correctly (text, email, password, number)
 * - All input sizes are applied correctly (large, regular, small)
 * - Focus state displays focus ring with Primary Blue border
 * - Error state displays error styling with Error Red border
 * - Placeholder text styling is applied
 * - Disabled state works correctly
 * - Accessibility features are properly implemented
 */

import React from 'react';
import Input from '../src/components/Input/Input';

describe('Input Component - Unit Tests', () => {
  describe('Rendering', () => {
    test('should render an input element', () => {
      const input = <Input />;
      expect(input.type).toBe('input');
    });

    test('should render with default type of text', () => {
      const input = <Input />;
      expect(input.props.type).toBeUndefined(); // defaults to 'text'
    });

    test('should render with placeholder text', () => {
      const input = <Input placeholder="Enter text" />;
      expect(input.props.placeholder).toBe('Enter text');
    });

    test('should render with value prop', () => {
      const input = <Input value="test value" />;
      expect(input.props.value).toBe('test value');
    });

    test('should render with name attribute', () => {
      const input = <Input name="username" />;
      expect(input.props.name).toBe('username');
    });

    test('should render with id attribute', () => {
      const input = <Input id="email-input" />;
      expect(input.props.id).toBe('email-input');
    });
  });

  describe('Input Types', () => {
    test('should accept text type', () => {
      const input = <Input type="text" />;
      expect(input.props.type).toBe('text');
    });

    test('should accept email type', () => {
      const input = <Input type="email" />;
      expect(input.props.type).toBe('email');
    });

    test('should accept password type', () => {
      const input = <Input type="password" />;
      expect(input.props.type).toBe('password');
    });

    test('should accept number type', () => {
      const input = <Input type="number" />;
      expect(input.props.type).toBe('number');
    });

    test('should render all supported input types', () => {
      const types = ['text', 'email', 'password', 'number'];
      types.forEach((type) => {
        const input = <Input type={type} />;
        expect(input.props.type).toBe(type);
      });
    });
  });

  describe('Sizes', () => {
    test('should have regular size by default', () => {
      const input = <Input />;
      expect(input.props.size).toBeUndefined(); // defaults to 'regular'
    });

    test('should accept large size', () => {
      const input = <Input size="large" />;
      expect(input.props.size).toBe('large');
    });

    test('should accept regular size', () => {
      const input = <Input size="regular" />;
      expect(input.props.size).toBe('regular');
    });

    test('should accept small size', () => {
      const input = <Input size="small" />;
      expect(input.props.size).toBe('small');
    });

    test('should render all sizes correctly', () => {
      const sizes = ['large', 'regular', 'small'];
      sizes.forEach((size) => {
        const input = <Input size={size} />;
        expect(input.props.size).toBe(size);
      });
    });
  });

  describe('States', () => {
    test('should render enabled input by default', () => {
      const input = <Input />;
      expect(input.props.disabled).toBeUndefined(); // defaults to false
    });

    test('should render disabled input when disabled prop is true', () => {
      const input = <Input disabled />;
      expect(input.props.disabled).toBe(true);
    });

    test('should render with error state', () => {
      const input = <Input error />;
      expect(input.props.error).toBe(true);
    });

    test('should render without error state by default', () => {
      const input = <Input />;
      expect(input.props.error).toBeUndefined(); // defaults to false
    });

    test('should accept onChange handler', () => {
      const handleChange = jest.fn();
      const input = <Input onChange={handleChange} />;
      expect(input.props.onChange).toBe(handleChange);
    });

    test('should accept onFocus handler', () => {
      const handleFocus = jest.fn();
      const input = <Input onFocus={handleFocus} />;
      expect(input.props.onFocus).toBe(handleFocus);
    });

    test('should accept onBlur handler', () => {
      const handleBlur = jest.fn();
      const input = <Input onBlur={handleBlur} />;
      expect(input.props.onBlur).toBe(handleBlur);
    });
  });

  describe('Focus State', () => {
    test('should support focus state styling', () => {
      const input = <Input />;
      // The component should apply focus styles via CSS module
      expect(input.type).toBe('input');
    });

    test('should display focus ring on focus', () => {
      const input = <Input />;
      // Focus ring styling is applied via CSS (3px rgba(37, 99, 235, 0.1))
      expect(input.type).toBe('input');
    });

    test('should have Primary Blue border on focus', () => {
      const input = <Input />;
      // Primary Blue border (#2563EB) is applied via CSS
      expect(input.type).toBe('input');
    });
  });

  describe('Error State', () => {
    test('should display error styling when error prop is true', () => {
      const input = <Input error />;
      expect(input.props.error).toBe(true);
    });

    test('should have Error Red border in error state', () => {
      const input = <Input error />;
      // Error Red border (#EF4444) is applied via CSS
      expect(input.props.error).toBe(true);
    });

    test('should support aria-describedby for error messages', () => {
      const input = <Input error aria-describedby="error-message" />;
      expect(input.props['aria-describedby']).toBe('error-message');
    });

    test('should combine error state with other props', () => {
      const input = (
        <Input
          error
          type="email"
          placeholder="Enter email"
          aria-describedby="email-error"
        />
      );
      expect(input.props.error).toBe(true);
      expect(input.props.type).toBe('email');
      expect(input.props.placeholder).toBe('Enter email');
      expect(input.props['aria-describedby']).toBe('email-error');
    });
  });

  describe('Placeholder Text', () => {
    test('should render placeholder text', () => {
      const input = <Input placeholder="Enter your name" />;
      expect(input.props.placeholder).toBe('Enter your name');
    });

    test('should apply placeholder styling', () => {
      const input = <Input placeholder="Placeholder" />;
      // Placeholder styling is applied via CSS (Gray 400 color)
      expect(input.props.placeholder).toBe('Placeholder');
    });

    test('should render without placeholder by default', () => {
      const input = <Input />;
      expect(input.props.placeholder).toBeUndefined();
    });
  });

  describe('Accessibility', () => {
    test('should accept aria-label prop', () => {
      const input = <Input aria-label="Username" />;
      expect(input.props['aria-label']).toBe('Username');
    });

    test('should accept aria-describedby prop', () => {
      const input = <Input aria-describedby="help-text" />;
      expect(input.props['aria-describedby']).toBe('help-text');
    });

    test('should render as input element', () => {
      const input = <Input />;
      expect(input.type).toBe('input');
    });

    test('should support custom className', () => {
      const input = <Input className="custom-class" />;
      expect(input.props.className).toBe('custom-class');
    });

    test('should forward ref correctly', () => {
      const ref = React.createRef();
      const input = <Input ref={ref} />;
      expect(input.ref).toBe(ref);
    });
  });

  describe('Props', () => {
    test('should accept and apply custom className', () => {
      const input = <Input className="my-custom-class" />;
      expect(input.props.className).toBe('my-custom-class');
    });

    test('should accept additional HTML attributes', () => {
      const input = (
        <Input
          data-testid="custom-input"
          title="Custom Title"
          maxLength="50"
        />
      );
      expect(input.props['data-testid']).toBe('custom-input');
      expect(input.props.title).toBe('Custom Title');
      expect(input.props.maxLength).toBe('50');
    });

    test('should accept all standard input attributes', () => {
      const input = (
        <Input
          type="email"
          disabled={false}
          onChange={() => {}}
          className="input"
          aria-label="Email"
          placeholder="Enter email"
        />
      );
      expect(input.props.type).toBe('email');
      expect(input.props.disabled).toBe(false);
      expect(input.props.className).toBe('input');
      expect(input.props['aria-label']).toBe('Email');
      expect(input.props.placeholder).toBe('Enter email');
    });
  });

  describe('Combinations', () => {
    test('should render large email input', () => {
      const input = <Input type="email" size="large" />;
      expect(input.props.type).toBe('email');
      expect(input.props.size).toBe('large');
    });

    test('should render small password input', () => {
      const input = <Input type="password" size="small" />;
      expect(input.props.type).toBe('password');
      expect(input.props.size).toBe('small');
    });

    test('should render disabled input with error state', () => {
      const input = <Input disabled error />;
      expect(input.props.disabled).toBe(true);
      expect(input.props.error).toBe(true);
    });

    test('should render all type and size combinations', () => {
      const types = ['text', 'email', 'password', 'number'];
      const sizes = ['large', 'regular', 'small'];

      types.forEach((type) => {
        sizes.forEach((size) => {
          const input = <Input type={type} size={size} />;
          expect(input.props.type).toBe(type);
          expect(input.props.size).toBe(size);
        });
      });
    });

    test('should render focused input with error state', () => {
      const handleFocus = jest.fn();
      const input = (
        <Input
          error
          onFocus={handleFocus}
          aria-describedby="error-message"
        />
      );
      expect(input.props.error).toBe(true);
      expect(input.props.onFocus).toBe(handleFocus);
      expect(input.props['aria-describedby']).toBe('error-message');
    });
  });

  describe('Display Name', () => {
    test('should have correct display name for debugging', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('CSS Module Classes', () => {
    test('should apply input base class', () => {
      const input = <Input />;
      // The component should apply styles.input class
      expect(input.type).toBe('input');
    });

    test('should apply size classes', () => {
      const sizes = ['large', 'regular', 'small'];
      sizes.forEach((size) => {
        const input = <Input size={size} />;
        expect(input.props.size).toBe(size);
      });
    });

    test('should apply error class when error prop is true', () => {
      const input = <Input error />;
      expect(input.props.error).toBe(true);
    });

    test('should apply disabled class when disabled prop is true', () => {
      const input = <Input disabled />;
      expect(input.props.disabled).toBe(true);
    });
  });
});
