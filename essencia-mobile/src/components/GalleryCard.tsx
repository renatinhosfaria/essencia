import { GalleryPost } from "@/types/gallery";
import { Play } from "@tamagui/lucide-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Image, Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";

interface GalleryCardProps {
  post: GalleryPost;
  onPress?: () => void;
}

export function GalleryCard({ post, onPress }: GalleryCardProps) {
  const formattedDate = format(new Date(post.createdAt), "d 'de' MMM", {
    locale: ptBR,
  });

  const primaryMedia = post.mediaItems?.[0];
  const previewUrl = primaryMedia?.thumbnailUrl || primaryMedia?.url;
  const isVideo = primaryMedia?.type === "video";

  return (
    <Pressable onPress={onPress}>
      <YStack
        bg="white"
        br="$4"
        overflow="hidden"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={2}
      >
        {/* Media */}
        <YStack position="relative" height={200}>
          {previewUrl ? (
            <Image
              source={{ uri: previewUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <YStack width="100%" height="100%" bg="$background" />
          )}

          {/* Video indicator */}
          {isVideo && (
            <YStack
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              ai="center"
              jc="center"
              bg="rgba(0,0,0,0.3)"
            >
              <YStack
                bg="rgba(255,255,255,0.9)"
                w={48}
                h={48}
                br={24}
                ai="center"
                jc="center"
              >
                <Play size={24} color="#333333" />
              </YStack>
            </YStack>
          )}

          {/* Date badge */}
          <YStack
            position="absolute"
            top="$2"
            right="$2"
            bg="rgba(0,0,0,0.6)"
            px="$2"
            py="$1"
            br="$2"
          >
            <Text color="white" fontSize={12} fontWeight="600">
              {formattedDate}
            </Text>
          </YStack>
        </YStack>

        {/* Content */}
        <YStack p="$3" gap="$1">
          {post.title && (
            <Text
              fontSize={16}
              fontWeight="600"
              color="$color"
              numberOfLines={2}
            >
              {post.title}
            </Text>
          )}

          {post.description && (
            <Text fontSize={14} color="$color" opacity={0.7} numberOfLines={2}>
              {post.description}
            </Text>
          )}

          {/* Tagged students */}
          {post.taggedStudents && post.taggedStudents.length > 0 && (
            <XStack ai="center" gap="$1" mt="$1">
              <Text fontSize={12} color="$secondary">
                👤{" "}
                {post.taggedStudents
                  .map((s) => s.name.split(" ")[0])
                  .join(", ")}
              </Text>
            </XStack>
          )}

          {/* Author */}
          {post.createdByName && (
            <Text fontSize={12} color="$placeholder" mt="$1">
              Por {post.createdByName}
            </Text>
          )}
        </YStack>
      </YStack>
    </Pressable>
  );
}
