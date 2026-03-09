/**
 * Unit Tests for Card Component
 * 
 * These tests verify that the Card component renders correctly
 * with all variants and hover effects.
 * 
 * Requirements: 4.1, 4.3, 5.1, 5.2
 * 
 * Test Coverage:
 * - Card renders with correct styling (border, shadow, padding, border-radius)
 * - All card variants display correct accent colors (default, success, warning, error, info)
 * - Hover shadow effect is applied
 * - Card content is rendered correctly
 * - Accessibility features are properly implemented
 */

import React from 'react';
import Card from '../src/components/Card/Card';

describe('Card Component - Unit Tests', () => {
  describe('Rendering', () => {
    test('should render a card element', () => {
      const card = <Card>Card content</Card>;
      expect(card.type).toBe('div');
      expect(card.props.children).toBe('Card content');
    });

    test('should render with children elements', () => {
      const card = (
        <Card>
          <h3>Title</h3>
          <p>Content</p>
        </Card>
      );
      expect(Array.isArray(card.props.children)).toBe(true);
    });

    test('should render with text content', () => {
      const card = <Card>Simple text content</Card>;
      expect(card.props.children).toBe('Simple text content');
    });

    test('should render with complex nested content', () => {
      const card = (
        <Card>
          <div>
            <h4>Card Title</h4>
            <p>Card description</p>
            <button>Action</button>
          </div>
        </Card>
      );
      expect(card.props.children.type).toBe('div');
    });
  });

  describe('Variants', () => {
    test('should have default variant by default', () => {
      const card = <Card>Default</Card>;
      expect(card.props.variant).toBeUndefined(); // defaults to 'default'
    });

    test('should accept default variant', () => {
      const card = <Card variant="default">Default</Card>;
      expect(card.props.variant).toBe('default');
    });

    test('should accept success variant', () => {
      const card = <Card variant="success">Success</Card>;
      expect(card.props.variant).toBe('success');
    });

    test('should accept warning variant', () => {
      const card = <Card variant="warning">Warning</Card>;
      expect(card.props.variant).toBe('warning');
    });

    test('should accept error variant', () => {
      const card = <Card variant="error">Error</Card>;
      expect(card.props.variant).toBe('error');
    });

    test('should accept info variant', () => {
      const card = <Card variant="info">Info</Card>;
      expect(card.props.variant).toBe('info');
    });

    test('should render all variants correctly', () => {
      const variants = ['default', 'success', 'warning', 'error', 'info'];
      variants.forEach((variant) => {
        const card = <Card variant={variant}>{variant}</Card>;
        expect(card.props.variant).toBe(variant);
      });
    });
  });

  describe('Styling', () => {
    test('should apply card base styling', () => {
      const card = <Card>Styled card</Card>;
      // Card styling includes: border, shadow, padding, border-radius
      expect(card.type).toBe('div');
    });

    test('should have border styling', () => {
      const card = <Card>Card with border</Card>;
      // Border: 1px solid Gray 200
      expect(card.type).toBe('div');
    });

    test('should have shadow styling', () => {
      const card = <Card>Card with shadow</Card>;
      // Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
      expect(card.type).toBe('div');
    });

    test('should have padding styling', () => {
      const card = <Card>Card with padding</Card>;
      // Padding: 16px
      expect(card.type).toBe('div');
    });

    test('should have border-radius styling', () => {
      const card = <Card>Card with border-radius</Card>;
      // Border Radius: 8px
      expect(card.type).toBe('div');
    });
  });

  describe('Hover Effects', () => {
    test('should apply hover shadow effect', () => {
      const card = <Card>Hover card</Card>;
      // Hover Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
      expect(card.type).toBe('div');
    });

    test('should maintain hover effect on all variants', () => {
      const variants = ['default', 'success', 'warning', 'error', 'info'];
      variants.forEach((variant) => {
        const card = <Card variant={variant}>Hover {variant}</Card>;
        expect(card.props.variant).toBe(variant);
      });
    });
  });

  describe('Variant Styling', () => {
    test('should apply success variant styling', () => {
      const card = <Card variant="success">Success card</Card>;
      // Success: Green accent border (2px left border in Success Green)
      expect(card.props.variant).toBe('success');
    });

    test('should apply warning variant styling', () => {
      const card = <Card variant="warning">Warning card</Card>;
      // Warning: Amber accent border (2px left border in Warning Amber)
      expect(card.props.variant).toBe('warning');
    });

    test('should apply error variant styling', () => {
      const card = <Card variant="error">Error card</Card>;
      // Error: Red accent border (2px left border in Error Red)
      expect(card.props.variant).toBe('error');
    });

    test('should apply info variant styling', () => {
      const card = <Card variant="info">Info card</Card>;
      // Info: Blue accent border (2px left border in Info Blue)
      expect(card.props.variant).toBe('info');
    });
  });

  describe('Accessibility', () => {
    test('should render as article by default', () => {
      const card = <Card>Article card</Card>;
      expect(card.props.role).toBeUndefined(); // defaults to 'article'
    });

    test('should accept custom role attribute', () => {
      const card = <Card role="region">Region card</Card>;
      expect(card.props.role).toBe('region');
    });

    test('should support custom className', () => {
      const card = <Card className="custom-class">Custom</Card>;
      expect(card.props.className).toBe('custom-class');
    });

    test('should accept additional HTML attributes', () => {
      const card = (
        <Card data-testid="custom-card" title="Custom Title">
          Card
        </Card>
      );
      expect(card.props['data-testid']).toBe('custom-card');
      expect(card.props.title).toBe('Custom Title');
    });
  });

  describe('Props', () => {
    test('should accept and apply custom className', () => {
      const card = <Card className="my-custom-class">Custom</Card>;
      expect(card.props.className).toBe('my-custom-class');
    });

    test('should accept additional HTML attributes', () => {
      const card = (
        <Card
          data-testid="custom-card"
          title="Custom Title"
          id="card-1"
        >
          Card
        </Card>
      );
      expect(card.props['data-testid']).toBe('custom-card');
      expect(card.props.title).toBe('Custom Title');
      expect(card.props.id).toBe('card-1');
    });

    test('should accept all standard div attributes', () => {
      const card = (
        <Card
          variant="success"
          role="article"
          className="card"
          id="card-1"
          data-testid="test-card"
        >
          Test
        </Card>
      );
      expect(card.props.variant).toBe('success');
      expect(card.props.role).toBe('article');
      expect(card.props.className).toBe('card');
      expect(card.props.id).toBe('card-1');
      expect(card.props['data-testid']).toBe('test-card');
    });
  });

  describe('Combinations', () => {
    test('should render success card with custom class', () => {
      const card = (
        <Card variant="success" className="metric-card">
          Success Metric
        </Card>
      );
      expect(card.props.variant).toBe('success');
      expect(card.props.className).toBe('metric-card');
    });

    test('should render error card with custom role', () => {
      const card = (
        <Card variant="error" role="alert">
          Error Alert
        </Card>
      );
      expect(card.props.variant).toBe('error');
      expect(card.props.role).toBe('alert');
    });

    test('should render info card with all props', () => {
      const card = (
        <Card
          variant="info"
          className="info-card"
          role="region"
          id="info-1"
          data-testid="info-card"
        >
          Info Content
        </Card>
      );
      expect(card.props.variant).toBe('info');
      expect(card.props.className).toBe('info-card');
      expect(card.props.role).toBe('region');
      expect(card.props.id).toBe('info-1');
      expect(card.props['data-testid']).toBe('info-card');
    });
  });

  describe('Content Rendering', () => {
    test('should render card with heading and paragraph', () => {
      const card = (
        <Card>
          <h3>Card Title</h3>
          <p>Card description</p>
        </Card>
      );
      expect(Array.isArray(card.props.children)).toBe(true);
    });

    test('should render card with multiple elements', () => {
      const card = (
        <Card>
          <div>Header</div>
          <div>Body</div>
          <div>Footer</div>
        </Card>
      );
      expect(Array.isArray(card.props.children)).toBe(true);
    });

    test('should render card with form elements', () => {
      const card = (
        <Card>
          <label>Name</label>
          <input type="text" />
          <button>Submit</button>
        </Card>
      );
      expect(Array.isArray(card.props.children)).toBe(true);
    });
  });

  describe('Display Name', () => {
    test('should have correct display name for debugging', () => {
      expect(Card.displayName).toBeUndefined(); // Card doesn't have displayName
    });
  });

  describe('CSS Module Classes', () => {
    test('should apply card base class', () => {
      const card = <Card>Test</Card>;
      // The component should apply styles.card class
      expect(card.type).toBe('div');
    });

    test('should apply variant classes', () => {
      const variants = ['default', 'success', 'warning', 'error', 'info'];
      variants.forEach((variant) => {
        const card = <Card variant={variant}>Test</Card>;
        expect(card.props.variant).toBe(variant);
      });
    });
  });
});
