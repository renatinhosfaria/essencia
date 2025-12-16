export interface DiaryStatus {
  hasEntry: boolean;
  date: string;
  entryCount: number;
  lastUpdated?: string;
}

export interface UnreadMessagesCount {
  count: number;
  latestSender?: string;
  latestMessage?: string;
}

export interface RecentAnnouncement {
  id: string;
  title: string;
  excerpt: string;
  createdAt: string;
  isRead: boolean;
}

export interface DashboardData {
  diaryStatus: DiaryStatus;
  unreadMessages: UnreadMessagesCount;
  announcements: RecentAnnouncement[];
}
