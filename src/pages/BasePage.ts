import { Locator, Page } from '@playwright/test';

/**
 * Common surface shared by all page objects. Exposes the `Page` reference
 * and a label-proximity helper used by OrangeHRM forms, whose inputs lack
 * `for`/`id` associations that would let `getByLabel` work.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly path: string;

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  /**
   * Returns the first `input`/`textarea` that follows a label whose text
   * exactly matches `label`. Works across OrangeHRM screens because every
   * form lays labels out above their inputs.
   */
  protected fieldByLabel(label: string): Locator {
    return this.page.locator(
      `xpath=(//label[normalize-space()=${xpathLiteral(label)}]/following::input | //label[normalize-space()=${xpathLiteral(label)}]/following::textarea)[1]`,
    );
  }
}

/**
 * Quote a string for XPath. XPath has no backslash escaping, so a string
 * containing both kinds of quotes must be assembled via concat().
 */
function xpathLiteral(s: string): string {
  if (!s.includes("'")) return `'${s}'`;
  if (!s.includes('"')) return `"${s}"`;
  const parts = s.split("'").map((p) => `'${p}'`);
  return `concat(${parts.join(`, "'", `)})`;
}
