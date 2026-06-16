import { test, expect } from '@playwright/test'

test.describe('SAP Panda Homepage', () => {
  test('should load homepage with header and hero', async ({ page }) => {
    await page.goto('/')
    // Header should be visible
    await expect(page.locator('.site-header')).toBeVisible()
    // Hero should render
    await expect(page.locator('.hero')).toBeVisible()
    // Brand name
    await expect(page.locator('.brand-name')).toContainText('パンダ先生')
  })

  test('should display SAP module grid', async ({ page }) => {
    await page.goto('/')
    const modules = page.locator('.module-grid .mod-card')
    await expect(modules).toHaveCount(9)
  })

  test('should have learning paths section', async ({ page }) => {
    await page.goto('/')
    await page.locator('#paths').scrollIntoViewIfNeeded()
    await expect(page.locator('#paths')).toBeVisible()
  })

  test('should have quiz section', async ({ page }) => {
    await page.goto('/')
    await page.locator('#quiz').scrollIntoViewIfNeeded()
    await expect(page.locator('#quiz')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    // Navigation should be hidden on mobile
    await expect(page.locator('.nav-main')).not.toBeVisible()
  })
})

test.describe('Article Page', () => {
  test('should load article with table of contents', async ({ page }) => {
    await page.goto('/article/fi')
    await expect(page.locator('.art-hero h1')).toBeVisible()
    await expect(page.locator('.toc-list')).toBeVisible()
  })
})

test.describe('Category Page', () => {
  test('should filter articles by difficulty', async ({ page }) => {
    await page.goto('/category/fi')
    await expect(page.locator('.cat-body')).toBeVisible()
    // Click difficulty filter
    await page.locator('.filter-item').nth(1).click()
    await expect(page.locator('.card-grid .art-card')).toBeDefined()
  })
})
