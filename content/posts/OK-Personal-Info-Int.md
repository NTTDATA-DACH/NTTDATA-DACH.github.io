---
title: "Personal Information Integration"
type: article
date: 2021-07-01
image: "/posts/img/personal-info.png"
draft: false
tags: ["process automation"]
authors:
 - Oliver Koeth
summary: "Thanks to the internet we have access to a virtually unlimited amount of information. But thanks to the internet we also feel that we are drowning in this information tsunami."
---
[img_1]: /posts/img/personal-info_img_1.png
[img_2]: /posts/img/personal-info_img_2.png "Overview of personal information integration architecture"


We receive interesting links through Twitter, Facebook, LinkedIn, Chatter, and email. 
We stumble upon interesting information on news sites like The Atlantic, Fast Company, Wired, and the local newspaper. 
We follow topics in Slideshare and Reddit. 
And how often have we encountered the situation that we know there was an interesting article but we cannot find it? 
And how often do we hesitate to share valuable information with our network, just because it is such a hassle to put this link also up in Chatter.

Fortunately, the situation is getting better as the Internet gets more and more support for process automation. 
With the right tools, every technically inclined user can easily apply and extend the techniques introduced in this article. 
No programming skills required.

And — a question of particular interest for me as an Enterprise Solution Architect 
—do provide these emerging automation and integration technologies from the consumer space a glimpse in the future of enterprise integration? 
In the same way as REST services today deliver the promises of EAI and SOA from the yesteryears?

## Personal Information Integration Architecture
![img_1]

The architecture is comprised of the following key components:

**Twitter:** The primary channel to receive information from various sources. By following news sites in Twitter, all information is provided in one stream — 
no need to go from site to site to collect the information. Twitter can also be used to share information.

**IF:** The key component for automation. While Twitter is good in taking information in, 
it is not so good in sending information to other channels like Chatter, LinkedIn, or Facebook. 
With IF it is possible to use hash tags to route information to any combination of channels by implementing a recipe. 
IF also helps to seamlessly move information from Twitter into Pocket.

**Pocket:** The ultimate reading machine. It is available cross channel and cross platform and presents web sites in a highly readable format with adjustable font sizes. 
Reading is as efficient as in an e-book app like Kindle. From Pocket an article can be shared again via Twitter (and other channels using IF) and archived in Evernote.

**Evernote:** Is one of the few web services I have a premium subscription for and serves as a fully searchable long term archive. 
Besides articles from Pocket, it also holds all my PDFs (as long as not subject to corporate security regulations).

**Safari / Chrome:** Both Safari and Chrome have an integration with Pocket so that all information identified during internet research can be easily fed into Pocket 
for further processing. For immediate long term storage, the Evernote WebClipper can be used.

**Chatter / LinkedIn / Facebook:** Are the main channels for sending out information. As it is quite cumbersome to share the information manually, 
all sharing is through Twitter and IF automates other channels.

## Personal Information Integration in Action
The diagram below shows, how information is flowing through the architecture. An article is coming in through Twitter. 
As the subject appears to be interesting I mark it as a favourite (e.g. using Twitterific while waiting to board an train). 
On the train, I can then read through the marked articles in Pocket and if worthwhile share them through Twitter 
(one click in Pocket plus adding tags for additional channels). 
And if the article is really relevant I move it to Evernote for long-term storage

![img_2]

Overall, this integrated and automated set of web services helps me to process my information as efficient as possible and to build up a personal archive 
which can be searched independent of how high or low an item currently ranks with search engines or whether or not it is still online.

What’s not perfect yet is running this process offline, as many integration points still rely on online connections. 
With moving more integration points from synchronous interactions (like clicking a share button) to asynchronous interactions 
(like tagging in Pocket and then following up with an IF recipe) the situation can however be improved.

Needless to say that I wrote this article on Evernote (then transferred to Medium) and published it over Twitter with #li and #ct tags.

I’looking forward to comments on how this architecture can evolve further and what other creative use cases can be implemented 
(e.g. send LinkedIn invitation to connect to new Twitter followers is still on my todo list).

