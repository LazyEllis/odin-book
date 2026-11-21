import { describe, it, expect } from "vitest";
import { getConfirmationContent } from "./format";

describe("getConfirmationContent", () => {
  it("returns the correct content for post deletion dialogs", () => {
    expect(getConfirmationContent("DELETE")).toEqual({
      title: "Delete post?",
      message:
        "This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.",
      button: "Delete",
    });
  });

  it("returns the correct content for post pinning dialogs", () => {
    expect(getConfirmationContent("PIN", false)).toEqual({
      title: "Pin post to profile?",
      message:
        "This will appear at the top of your profile and replace any previously pinned post.",
      button: "Pin",
    });
  });

  it("returns the correct content for post unpinning dialogs", () => {
    expect(getConfirmationContent("PIN", true)).toEqual({
      title: "Unpin post from profile?",
      message:
        "This will no longer appear automatically at the top of your profile.",
      button: "Unpin",
    });
  });
});
