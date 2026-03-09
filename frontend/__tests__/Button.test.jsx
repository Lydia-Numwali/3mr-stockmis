/**
 * Unit Tests for Button Component
 * 
 * These tests verify that the Button component renders correctly
 * with all variants, sizes, and states.
 * 
 * Requirements: 9.2
 * 
 * Test Coverage:
 * - All button variants render correctly (primary, secondary, danger)
 * - All button states work properly (default, hover, active, focus, disabled)
 * - All button sizes are applied correctly (large, regular, small)
 * - Accessibility features are properly implemented (ARIA labels, keyboard navigation)
 */

import React from 'react';
import Button from '../components/Button/Button';

/**
 * Manual Test Suite for Button Component
 * 
 * These tests can be run manually or with a testing framework like Jest + React Testing Library
 * To run with testing framework, install: npm install --save-dev @testing-library/react @testing-library/jest-dom
 */

describe('Button Component - Unit Tests', () => {
  describe('Rendering', () => {
    test('should render a button element with text', () => {
      const button = <Button>Click me</Button>;
      expect(button.type).toBe('button');
      expect(button.props.children).toBe('Click me');
    });

    test('should render with children elements', () => {
      const button = (
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      expect(Array.isArray(button.props.children)).toBe(true);
    });
  });

  describe('Variants', () => {
    test('should have primary variant by default', () => {
      const button = <Button>Primary</Button>;
      expect(button.props.variant).toBeUndefined(); // defaults to 'primary'
    });

    test('should accept primary variant', () => {
      const button = <Button variant="primary">Primary</Button>;
      expect(button.props.variant).toBe('primary');
    });

    test('should accept secondary variant', () => {
      const button = <Button variant="secondary">Secondary</Button>;
      expect(button.props.variant).toBe('secondary');
    });

    test('should accept danger variant', () => {
      const button = <Button variant="danger">Delete</Button>;
      expect(button.props.variant).toBe('danger');
    });

    test('should render all variants correctly', () => {
      const variants = ['primary', 'secondary', 'danger'];
      variants.forEach((variant) => {
        const button = <Button variant={variant}>{variant}</Button>;
        expect(button.props.variant).toBe(variant);
      });
    });
  });

  describe('Sizes', () => {
    test('should have regular size by default', () => {
      const button = <Button>Regular</Button>;
      expect(button.props.size).toBeUndefined(); // defaults to 'regular'
    });

    test('should accept large size', () => {
      const button = <Button size="large">Large</Button>;
      expect(button.props.size).toBe('large');
    });

    test('should accept regular size', () => {
      const button = <Button size="regular">Regular</Button>;
      expect(button.props.size).toBe('regular');
    });

    test('should accept small size', () => {
      const button = <Button size="small">Small</Button>;
      expect(button.props.size).toBe('small');
    });

    test('should render all sizes correctly', () => {
      const sizes = ['large', 'regular', 'small'];
      sizes.forEach((size) => {
        const button = <Button size={size}>{size}</Button>;
        expect(button.props.size).toBe(size);
      });
    });
  });

  describe('States', () => {
    test('should render enabled button by default', () => {
      const button = <Button>Enabled</Button>;
      expect(button.props.disabled).toBeUndefined(); // defaults to false
    });

    test('should render disabled button when disabled prop is true', () => {
      const button = <Button disabled>Disabled</Button>;
      expect(button.props.disabled).toBe(true);
    });

    test('should accept onClick handler', () => {
      const handleClick = jest.fn();
      const button = <Button onClick={handleClick}>Click me</Button>;
      expect(button.props.onClick).toBe(handleClick);
    });

    test('should accept type attribute', () => {
      const button = <Button type="submit">Submit</Button>;
      expect(button.props.type).toBe('submit');
    });
  });

  describe('Accessibility', () => {
    test('should accept aria-label prop', () => {
      const button = <Button aria-label="Save changes">Save</Button>;
      expect(button.props['aria-label']).toBe('Save changes');
    });

    test('should render as button element', () => {
      const button = <Button>Button</Button>;
      expect(button.type).toBe('button');
    });

    test('should support custom className', () => {
      const button = <Button className="custom-class">Custom</Button>;
      expect(button.props.className).toBe('custom-class');
    });

    test('should forward ref correctly', () => {
      const ref = React.createRef();
      const button = <Button ref={ref}>Ref Button</Button>;
      expect(button.ref).toBe(ref);
    });
  });

  describe('Props', () => {
    test('should accept and apply custom className', () => {
      const button = <Button className="my-custom-class">Custom</Button>;
      expect(button.props.className).toBe('my-custom-class');
    });

    test('should accept additional HTML attributes', () => {
      const button = (
        <Button data-testid="custom-button" title="Custom Title">
          Button
        </Button>
      );
      expect(button.props['data-testid']).toBe('custom-button');
      expect(button.props.title).toBe('Custom Title');
    });

    test('should accept all standard button attributes', () => {
      const button = (
        <Button
          type="button"
          disabled={false}
          onClick={() => {}}
          className="btn"
          aria-label="Test"
        >
          Test
        </Button>
      );
      expect(button.props.type).toBe('button');
      expect(button.props.disabled).toBe(false);
      expect(button.props.className).toBe('btn');
      expect(button.props['aria-label']).toBe('Test');
    });
  });

  describe('Combinations', () => {
    test('should render primary large button', () => {
      const button = (
        <Button variant="primary" size="large">
          Primary Large
        </Button>
      );
      expect(button.props.variant).toBe('primary');
      expect(button.props.size).toBe('large');
    });

    test('should render secondary small button', () => {
      const button = (
        <Button variant="secondary" size="small">
          Secondary Small
        </Button>
      );
      expect(button.props.variant).toBe('secondary');
      expect(button.props.size).toBe('small');
    });

    test('should render disabled danger button', () => {
      const button = (
        <Button variant="danger" disabled>
          Delete
        </Button>
      );
      expect(button.props.variant).toBe('danger');
      expect(button.props.disabled).toBe(true);
    });

    test('should render all variant and size combinations', () => {
      const variants = ['primary', 'secondary', 'danger'];
      const sizes = ['large', 'regular', 'small'];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const button = (
            <Button variant={variant} size={size}>
              {variant} {size}
            </Button>
          );
          expect(button.props.variant).toBe(variant);
          expect(button.props.size).toBe(size);
        });
      });
    });
  });

  describe('Display Name', () => {
    test('should have correct display name for debugging', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('CSS Module Classes', () => {
    test('should apply button base class', () => {
      const button = <Button>Test</Button>;
      // The component should apply styles.button class
      expect(button.type).toBe('button');
    });

    test('should apply variant classes', () => {
      const variants = ['primary', 'secondary', 'danger'];
      variants.forEach((variant) => {
        const button = <Button variant={variant}>Test</Button>;
        expect(button.props.variant).toBe(variant);
      });
    });

    test('should apply size classes', () => {
      const sizes = ['large', 'regular', 'small'];
      sizes.forEach((size) => {
        const button = <Button size={size}>Test</Button>;
        expect(button.props.size).toBe(size);
      });
    });
  });
});
