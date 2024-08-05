[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/hkgnp) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

> The Logseq team is working on properties feature as part of the database version. As such, development on this plugin will be limited since properties will eventually replace the function offered by this plugin.

# Introduction

Designate selected hashtags as PowerTags, and see them auto-create properties are you use them. This only applies to tags created using `#` and does not apply to page references, block references without the `#` and blocks that have the `tag` property.

![](./screenshots/demo.gif)

# Usage

## Creating Power Tags

1. Click on the plugin icon.
2. Enter your PowerTag, followed by the properties to assign to the PowerTag. You may also assign a default value.
3. Now the next time you use the tag, your properties will be auto-added.

## Managing Your Tags

1. Click on the plugin icon.
2. You will see a list of your created power tags.
3. Any actions performed here will affect past blocks created with the tag. For example,
   - Deleting a PowerTag
     - Removes all properties from blocks that have the tag, even those not created with this plugin.
   - Deleting a property of a PowerTag
     - Removes the property from blocks that have the tag, even those not created with this plugin.

> Important Note: Power tags are stored in the plugin settings. If the plugin settings file (found in `.logseq`) is deleted, you will need to manually create your power tags again.

# Installation

If not available from the marketplace, download the release and manually load it into Logseq after unzipping it.
