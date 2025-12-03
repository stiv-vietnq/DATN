interface CommentAvatarProps {
    avatarUrl?: string;
}

function CommentAvatar({ avatarUrl }: CommentAvatarProps) {
    const defaultAvatar = "https://hoanghamobile.com/Content/web/img/no-avt.png";

    return (
        <div className="comment-data-avatar">
            <img
                src={avatarUrl || defaultAvatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-400 object-cover"
            />
        </div>
    );
}

export default CommentAvatar;
