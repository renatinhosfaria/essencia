/**
 * Touch Target Accessibility Utilities
 *
 * WCAG 2.1 Level AAA requires 44×44px minimum touch targets.
 * We use 48×48px as our minimum standard (56×56px ideal for primary actions).
 *
 * References:
 * - WCAG 2.1: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
 * - Apple HIG: 44×44pt minimum
 * - Material Design: 48×48dp minimum
 */

export const TOUCH_TARGET_MIN = 48;
export const TOUCH_TARGET_IDEAL = 56;
export const TOUCH_SPACING_MIN = 8;

/**
 * Get the minimum touch target size, ensuring it meets accessibility standards
 * @param preferred - Preferred size (will be clamped to minimum)
 * @returns Size in pixels (minimum 48px)
 */
export function getTouchTargetSize(
  preferred: number = TOUCH_TARGET_MIN
): number {
  return Math.max(preferred, TOUCH_TARGET_MIN);
}

/**
 * Get touch target size for primary actions (larger for better UX)
 * @returns Size in pixels (56px)
 */
export function getPrimaryTouchTargetSize(): number {
  return TOUCH_TARGET_IDEAL;
}

/**
 * Get minimum spacing between adjacent touch targets
 * @returns Spacing in pixels (8px)
 */
export function getTouchSpacing(): number {
  return TOUCH_SPACING_MIN;
}
