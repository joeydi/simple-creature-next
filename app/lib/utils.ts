import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertRange(value: number, r1: number[], r2: number[]) {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0]
}

export function precisionRound(number: number, precision: number) {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

export function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomHexColor = () => {
  const n = (Math.random() * 0xfffff * 1000000).toString(16)
  return "#" + n.slice(0, 6)
}

/**
 * Creates a fluid CSS clamp value that scales between min and max based on viewport width
 * @param minValue - Minimum value in pixels
 * @param maxValue - Maximum value in pixels
 * @param minWidth - Minimum viewport width in pixels (default: 375)
 * @param maxWidth - Maximum viewport width in pixels (default: 1920)
 * @returns CSS clamp string
 * @example
 * fluid(16, 32) // "clamp(16px, calc(14.59px + 0.85vw), 32px)"
 * fluid(20, 80, 768, 1440) // Custom viewport range
 */
export function fluid(
  minValue: number,
  maxValue: number,
  minWidth: number = 375,
  maxWidth: number = 1920
): string {
  const slope = (maxValue - minValue) / (maxWidth - minWidth)
  const yAxisIntersection = -minWidth * slope + minValue

  return `clamp(${minValue}px, ${yAxisIntersection}px + ${slope * 100}vw, ${maxValue}px)`
}

/**
 * Creates a fluid CSS clamp value that scales in reverse (larger to smaller) based on viewport width
 * @param minValue - Minimum value in pixels (will be max at small viewports)
 * @param maxValue - Maximum value in pixels (will be min at small viewports)
 * @param minWidth - Minimum viewport width in pixels (default: 375)
 * @param maxWidth - Maximum viewport width in pixels (default: 1920)
 * @returns CSS clamp string
 */
export function fluidReverse(
  minValue: number,
  maxValue: number,
  minWidth: number = 375,
  maxWidth: number = 1920
): string {
  const slope = (maxValue - minValue) / (maxWidth - minWidth)
  const yAxisIntersection = -minWidth * slope + minValue

  return `clamp(${maxValue}px, ${yAxisIntersection}px + ${slope * 100}vw, ${minValue}px)`
}
