Brackets Disable AutoClose Tags extension
===
Brackets extension that will disable the AutoClose Tags "whenOpening" feature of Codemirror.

What this means is that it does not turn off all auto closing of HTML tags in Brackets. It turns off the auto closing when you create the opening tag of an element.

Here's an example. If you type this:

&lt;p&gt;

By default, Brackets will take over and close it with this:

&lt;p&gt;&lt;/p&gt;

Then place the cursor between the opening and closing tags of the element. This extension prevents that part. But if you type this:

&lt;p&gt;this is text&lt;/

Brackets will then close the rest of the tag like this:

&lt;p&gt;this is text&lt;/p&gt;

I prefer this behavior and before I would always edit the editor.js file in Brackets to change that setting. I eventually grew tired of having to do that with every version of Brackets so I decided to make an extension until Brackets has a proper preferences menu.

This extension has a checked entry under "Edit" in the main menu. It saves your preference to file so you can turn it on and off as needed and Brackets will start using your last choice. At first I wasn't going to do this making the change somewhat permanent but I decided to make it an option.

A similar idea could be used to turn off all auto closing of HTML tags. For this extension that would require a second entry in the menu or some sort of preferences modal.

To install this extension:
In Brackets, under "Help" select "Show Extensions Folder". Place extension folder with files inside the "user" folder.
Older versions of Brackets this choice might be under "Debug" or might not exist at all.


Usage
=====
Check or uncheck "Disable AutoClose Tags" under Edit.


Known issues
=====
Possibly not an issue, but changes the settings on any editor as it is opened regardless if it is HTML or not.