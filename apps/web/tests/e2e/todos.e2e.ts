import { expect, test } from "@playwright/test";

test("persists the todo lifecycle", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "A small list, kept moving." })).toBeVisible();

  await page.getByLabel("Todo title").fill("Verify the complete stack");
  await page.getByRole("button", { name: "Add todo" }).click();
  await expect(page.getByText("Verify the complete stack")).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: "Mark Verify the complete stack as complete" }).click();
  await expect(page.getByText("1 of 1 done")).toBeVisible();

  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Verify the complete stack" }).click();
  await expect(page.getByText("Nothing waiting on you.")).toBeVisible();
});
