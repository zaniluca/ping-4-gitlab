import { FlatList, ListRenderItem } from "react-native";
import React from "react";
import InboxItem from "./InboxItem";
import { ListSeparator } from "../ListSeparator";
import { Notification } from "../../utils/types";

const DATA: Notification[] = [
  {
    headers: `
    Received: by mx0091p1las1.sendgrid.net with SMTP id fYlOaN1dv5 Wed, 30 Mar 2022 14:39:04 +0000 (UTC)\n' +
    'Received: from so254-136.mailgun.net (unknown [198.61.254.136]) by mx0091p1las1.sendgrid.net (Postfix) with ESMTPS id EA8C6360D34 for <test@cloudmover.app>; Wed, 30 Mar 2022 14:39:03 +0000 (UTC)\n' +
    'DKIM-Signature: a=rsa-sha256; v=1; c=relaxed/relaxed; d=mg.gitlab.com; q=dns/txt; s=mailo; t=1648651143; h=List-Unsubscribe: List-Id: Content-Transfer-Encoding: Content-Type: Mime-Version: Subject: Subject: References: In-Reply-To: Message-ID: To: To: Reply-To: From: From: Date: Sender: Sender; bh=qw3zsbk3lR1Nb8QXo5IdjXPCT1F4mP7AfkfvgEWO3wk=; b=ggzJyWK44TqKVuZ+EB92VsR5Le6kx5vRqdwxzRWOHffxqEW8e4SFirAQgbFdUQqIKt61xkoH 19LAvbDYVWSrDUIm2qlfsc5FHBjcU93EEtOfd6yZKPEk9U9+EfXhr3TBMB0v2AB2vpNiZ385 ffC89R3U1KtbNT7ER7bJCApgm98=\n' +
    'X-Mailgun-Sending-Ip: 198.61.254.136\n' +
    'X-Mailgun-Sid: WyI4ZTU5ZSIsICJ0ZXN0QGNsb3VkbW92ZXIuYXBwIiwgIjk0N2I0Il0=\n' +
    'Received: from mg.gitlab.com (7.226.74.34.bc.googleusercontent.com [34.74.226.7]) by smtp-out-n07.prod.us-east-1.postgun.com with SMTP id 62446b8707b42f471c80b6c4 (version=TLS1.3, cipher=TLS_AES_128_GCM_SHA256); Wed, 30 Mar 2022 14:39:03 GMT\n' +
    'Sender: gitlab@mg.gitlab.com\n' +
    'Date: Wed, 30 Mar 2022 14:39:03 +0000\n' +
    'From: "Mattia Brunello (@mattia.brunello)" <gitlab@mg.gitlab.com>\n' +
    'Reply-To: kampaay / general <incoming+24ad322d9a8bfbca526e15627c568aa7@incoming.gitlab.com>\n' +
    'To: test@cloudmover.app\n' +
    'Message-ID: <note_894729379@gitlab.com>\n' +
    'In-Reply-To: <note_894721610@gitlab.com>\n' +
    'References: <reply-24ad322d9a8bfbca526e15627c568aa7@gitlab.com> <issue_102012870@gitlab.com> <note_894684822@gitlab.com> <note_894721610@gitlab.com>\n' +
    'Subject: Re: general | Beverage packages ready-to-buy (SF) (#679)\n' +
    'Mime-Version: 1.0\n' +
    'Content-Type: multipart/alternative; boundary="--==_mimepart_62446b873c850_264964c15557"; charset=UTF-8\n' +
    'Content-Transfer-Encoding: 7bit\n' +
    'X-GitLab-Project: general\n' +
    'X-GitLab-Project-Id: 18854524\n' +
    'X-GitLab-Project-Path: kampaay/general\n' +
    'List-Id: kampaay/general <18854524.general.kampaay.gitlab.com>\n' +
    'List-Unsubscribe: <https://gitlab.com/-/sent_notifications/24ad322d9a8bfbca526e15627c568aa7/unsubscribe?force=true>,<mailto:incoming+24ad322d9a8bfbca526e15627c568aa7-unsubscribe@incoming.gitlab.com>\n' +
    'X-GitLab-Issue-ID: 102012870\n' +
    'X-GitLab-Issue-IID: 679\n' +
    'X-GitLab-NotificationReason: \n' +
    'X-GitLab-Discussion-ID: 885ff363c1c35f3a72578061bc37cdfced5dc9a0\n' +
    'X-GitLab-Reply-Key: 24ad322d9a8bfbca526e15627c568aa7\n' +
    'Auto-Submitted: auto-generated\n' +
    'X-Auto-Response-Suppress: All\n
    `,
    timestamp: "2011-09-27T07:04:21.97-05:00",
    viewed: false,
    subject: "Re: general | Beverage packages ready-to-buy (SF) (#679)",
    text: "Tommaso Gangemi commented: @marco_ottone se per caso su SF (non dovrebbe accadere ma per sicurezza..) ho un preset con un drink che non c'è più nel catalogo, come dovremmo gestire la cosa? eliminiamo quel preset dal package o la gestiamo in qualche altro modo? @krzysztof.witkowski1 FYI",
  },
  {
    headers: `
    Received: by mx0091p1las1.sendgrid.net with SMTP id fYlOaN1dv5 Wed, 30 Mar 2022 14:39:04 +0000 (UTC)\n' +
    'Received: from so254-136.mailgun.net (unknown [198.61.254.136]) by mx0091p1las1.sendgrid.net (Postfix) with ESMTPS id EA8C6360D34 for <test@cloudmover.app>; Wed, 30 Mar 2022 14:39:03 +0000 (UTC)\n' +
    'DKIM-Signature: a=rsa-sha256; v=1; c=relaxed/relaxed; d=mg.gitlab.com; q=dns/txt; s=mailo; t=1648651143; h=List-Unsubscribe: List-Id: Content-Transfer-Encoding: Content-Type: Mime-Version: Subject: Subject: References: In-Reply-To: Message-ID: To: To: Reply-To: From: From: Date: Sender: Sender; bh=qw3zsbk3lR1Nb8QXo5IdjXPCT1F4mP7AfkfvgEWO3wk=; b=ggzJyWK44TqKVuZ+EB92VsR5Le6kx5vRqdwxzRWOHffxqEW8e4SFirAQgbFdUQqIKt61xkoH 19LAvbDYVWSrDUIm2qlfsc5FHBjcU93EEtOfd6yZKPEk9U9+EfXhr3TBMB0v2AB2vpNiZ385 ffC89R3U1KtbNT7ER7bJCApgm98=\n' +
    'X-Mailgun-Sending-Ip: 198.61.254.136\n' +
    'X-Mailgun-Sid: WyI4ZTU5ZSIsICJ0ZXN0QGNsb3VkbW92ZXIuYXBwIiwgIjk0N2I0Il0=\n' +
    'Received: from mg.gitlab.com (7.226.74.34.bc.googleusercontent.com [34.74.226.7]) by smtp-out-n07.prod.us-east-1.postgun.com with SMTP id 62446b8707b42f471c80b6c4 (version=TLS1.3, cipher=TLS_AES_128_GCM_SHA256); Wed, 30 Mar 2022 14:39:03 GMT\n' +
    'Sender: gitlab@mg.gitlab.com\n' +
    'Date: Wed, 30 Mar 2022 14:39:03 +0000\n' +
    'From: "Mattia Brunello (@mattia.brunello)" <gitlab@mg.gitlab.com>\n' +
    'Reply-To: kampaay / general <incoming+24ad322d9a8bfbca526e15627c568aa7@incoming.gitlab.com>\n' +
    'To: test@cloudmover.app\n' +
    'Message-ID: <note_894729379@gitlab.com>\n' +
    'In-Reply-To: <note_894721610@gitlab.com>\n' +
    'References: <reply-24ad322d9a8bfbca526e15627c568aa7@gitlab.com> <issue_102012870@gitlab.com> <note_894684822@gitlab.com> <note_894721610@gitlab.com>\n' +
    'Subject: Re: general | Beverage packages ready-to-buy (SF) (#679)\n' +
    'Mime-Version: 1.0\n' +
    'Content-Type: multipart/alternative; boundary="--==_mimepart_62446b873c850_264964c15557"; charset=UTF-8\n' +
    'Content-Transfer-Encoding: 7bit\n' +
    'X-GitLab-Project: general\n' +
    'X-GitLab-Project-Id: 18854524\n' +
    'X-GitLab-Project-Path: kampaay/general\n' +
    'List-Id: kampaay/general <18854524.general.kampaay.gitlab.com>\n' +
    'List-Unsubscribe: <https://gitlab.com/-/sent_notifications/24ad322d9a8bfbca526e15627c568aa7/unsubscribe?force=true>,<mailto:incoming+24ad322d9a8bfbca526e15627c568aa7-unsubscribe@incoming.gitlab.com>\n' +
    'X-GitLab-Issue-ID: 102012870\n' +
    'X-GitLab-Issue-IID: 679\n' +
    'X-GitLab-NotificationReason: \n' +
    'X-GitLab-Discussion-ID: 885ff363c1c35f3a72578061bc37cdfced5dc9a0\n' +
    'X-GitLab-Reply-Key: 24ad322d9a8bfbca526e15627c568aa7\n' +
    'Auto-Submitted: auto-generated\n' +
    'X-Auto-Response-Suppress: All\n
    `,
    timestamp: "2011-09-27T07:04:21.97-05:00",
    viewed: false,
    subject: "Re: general | Beverage packages ready-to-buy (SF) (#679)",
    text: "ommaso Gangemi commented: @marco_ottone se per caso su SF (non dovrebbe accadere ma per sicurezza..) ho un preset con un drink che non c'è più nel catalogo, come dovremmo gestire la cosa? eliminiamo quel preset dal package o la gestiamo in qualche altro modo? @krzysztof.witkowski1 FYI",
  },
];

const renderItem: ListRenderItem<Notification> = ({ item }) => (
  <InboxItem item={item} />
);

export default function InboxList() {
  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={DATA}
      renderItem={renderItem}
      ItemSeparatorComponent={ListSeparator}
      keyExtractor={(item) => item.text}
      removeClippedSubviews
    />
  );
}
