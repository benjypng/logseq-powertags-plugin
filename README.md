[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/hkgnp) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

# Introduction

Designate selected hashtags as PowerTags, and see them auto-create properties are you use them. 

This only applies to tags created using `#` and does not apply to page references, block references without the `#` and blocks that have the `tag` property.

![](/screenshots/demo.gif)

# Usage

## Creating Power Tags

1. Click on the plugin icon.
2. Enter your PowerTag, followed by the properties to assign to the PowerTag. You may also assign a default value.
3. You may use *dynamic variables* in your default values. This will then be automatically populated when using your PowerTag. You may refer to the [Dynamic Variables]() section for available variables.
4. Now the next time you use the tag, your properties will be auto-added.

## Managing Your Tags

1. Click on the plugin icon.
2. You will see a list of your created power tags.
3. Any actions performed here will affect past blocks created with the tag. For example,
   - Creating a new PowerTag
     - Does not affect past blocks with the tag.
   - Deleting a PowerTag
     - Removes all properties from blocks that have the tag, even those not created with this plugin.
   - Deleting a property of a PowerTag
     - Removes the property from blocks that have the tag, even those not created with this plugin.
   - Adding a property to an existing PowerTag
     - Adds the property to all blocks that have the tag, even those not created with this plugin.

> Important Note: PowerTags are stored in the plugin settings. If the plugin settings file (found in `.logseq`) is deleted, you will need to manually create your power tags again.

## Using Power Tags

### Option 1

By default, PowerTags are automatically parse when you presss `Enter` to create a new block. You can turn this behaviour off in the plugin settings.

### Option 2

If you turn off auto-parse, you may trigger the parsing manually by using the slash command at the end of your block with the PowerTag, i.e. `/Parse PowerTag`

# Dynamic Variables

The following are available to use in your default values:

|Dynamic Variable|Remarks|
|----------------|-------|
|<% today %>|Inserts the date today based on your preferred date format|
|<% yesterday %>|Inserts the date yesterday based on your preferred date format|
|<% tomorrow %>|Inserts the date tomorrow based on your preferred date format|
|<% time %>|Inserts the current time|
|<% current page %>|Inserts the current page name|

# Installation

If not available from the marketplace, download the release and manually load it into Logseq after unzipping it.
