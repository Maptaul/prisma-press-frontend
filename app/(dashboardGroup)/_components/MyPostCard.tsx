import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPost } from "@/lib/types";
import { MessageSquareIcon, SparklesIcon } from "lucide-react";
import { PostFormDialog } from "./PostFormDialog";

type MyPostCardProps = {
    post: IPost;
}

export function MyPostCard({ post }: MyPostCardProps) {
    const commentCount = post._count?.comments ?? post.comments?.length ?? 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline">{post.status}</Badge>
                    {
                        post.isPremium && (
                            <Badge>
                                <SparklesIcon data-icon="inline-start" />
                                Premium
                            </Badge>
                        )
                    }
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardAction>
                    <PostFormDialog mode="edit" post={post} />
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="line-clamp-3 whitespace-pre-line text-muted-foreground">
                    {post.content}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                        <MessageSquareIcon className="size-3.5" />
                        {commentCount}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
