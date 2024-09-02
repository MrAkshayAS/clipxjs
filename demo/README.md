# ClipX Attributes Documentation

This documentation provides details on the attributes used with the ClipX library for clipboard operations. Each attribute has a specific use case to enhance clipboard functionality.

## Attributes Overview

## This All Are Attributes
- **`data-clipx-target`**: Element selector for text source.
- **`data-clipx-text`**: Static text to copy or cut.
- **`data-clipx-cut`**: Toggle cut operation.
- **`data-clipx-msg`**: Custom success message.
- **`data-clipx-toast`**: Show only toast, no text change.
- **`data-clipx-disable-msg`**: Disable element text change.
- **`data-clipx-disable-toast`**: Disable toast notification.
- **`data-clipx-toast-position`**: Position of the toast (top/bottom).
- **`data-clipx-duration`**: Duration of toast visibility.

---


## Example 

### `data-clipx-target`

**Description:** Specifies the target element whose text will be copied to the clipboard when the button is clicked.

**Example:**
```html
<button class="copy-btn" data-clipx-target="#text-to-copy">Copy Text</button>
<p id="text-to-copy">This is the text to be copied.</p>
```

### `data-clipx-text`

**Description:** Defines a static text string that will be copied to the clipboard when the button is clicked.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Static text to copy">Copy Static Text</button>
```

### `data-clipx-cut`

**Description:** Cuts the text from the specified element, copying it to the clipboard and clearing the element's content.

**Example:**
```html
<textarea id="text-to-cut">This text will be cut.</textarea>
<button class="copy-btn" data-clipx-target="#text-to-cut" data-clipx-cut>Cut Text</button>
```

### `data-clipx-msg`

**Description:** Copies the specified text to the clipboard and shows a toast notification with a custom message.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Another static text" data-clipx-msg="Text copied successfully!">Copy with Custom Message</button>
```

### `data-clipx-toast`

**Description:** Displays a toast notification with the copied text. The button text remains unchanged.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-toast>Copy with Toast Only</button>
```

### `data-clipx-disable-msg`

**Description:** Shows a toast notification without changing the button's text content.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-disable-msg>Copy with Toast Only, No Text Change</button>
```

###  `USE data-clipx-disable-toast & data-clipx-disable-msg`

**Description:** Copies the specified text to the clipboard without showing a toast notification And Changing Text Contents.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-disable-toast data-clipx-disable-msg>Copy without Toast & with Change Text</button>
```

### `data-clipx-disable-toast`

**Description:** Copies the specified text to the clipboard without showing a toast notification.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-disable-toast>Copy without Toast</button>
```

### `data-clipx-toast-position`

**Description:** Defines the position of the toast notification (top or bottom).

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-toast data-clipx-toast-position="top">Copy with Toast on Top</button>
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-toast data-clipx-toast-position="bottom">Copy with Toast on Bottom</button>
```

### `data-clipx-duration`

**Description:** Sets the duration (in milliseconds) for which the toast notification is visible before it fades out.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-toast data-clipx-duration="3000">Copy with 3 Seconds Toast</button>
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-duration="3000">Copy with 3 Seconds Toast & Content Change</button>
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-disable-toast data-clipx-duration="3000">Copy 3 sec Content Change</button>
```
---
