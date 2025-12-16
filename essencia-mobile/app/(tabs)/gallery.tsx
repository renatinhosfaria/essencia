import { GalleryCard } from "@/components/GalleryCard";
import { SimplifiedScreenWrapper } from "@/components/SimplifiedScreenWrapper";
import { Skeleton } from "@/components/Skeleton";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useGalleryPosts } from "@/hooks/useGallery";
import { useScaledFont } from "@/hooks/useScaledFont";
import { GalleryPost } from "@/types/gallery";
import { Image as ImageIcon, RefreshCw } from "@tamagui/lucide-icons";
import { useState } from "react";
import { FlatList, Modal, Pressable, RefreshControl, Image as RNImage } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

export default function GalleryScreen() {
  const { settings } = useAccessibility();
  const titleSize = useScaledFont(6);
  const textSize = useScaledFont(4);

  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGalleryPosts(20);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Flatten pages into a single array
  const posts = data?.pages.flatMap((page) => page.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }: { item: GalleryPost }) => (
    <YStack px="$4" py="$2">
      <GalleryCard post={item} onPress={() => setSelectedPost(item)} />
    </YStack>
  );

  const renderHeader = () => (
    <YStack p="$4" gap="$2">
      <XStack ai="center" gap="$2">
        <ImageIcon size={28} color="$secondary" />
        <Text fontSize={titleSize} fontWeight="bold" color="$color">
          Galeria
        </Text>
      </XStack>
      <Text fontSize={textSize} color="$color" opacity={0.7}>
        Momentos especiais da escola
      </Text>
    </YStack>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <YStack p="$4" ai="center">
        <Skeleton height={200} width="100%" />
      </YStack>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <YStack gap="$4" px="$4">
          <Skeleton height={250} />
          <Skeleton height={250} />
        </YStack>
      );
    }

    return (
      <YStack f={1} ai="center" jc="center" p="$4" mt="$10">
        <Text fontSize={64} mb="$2">
          📸
        </Text>
        <Text
          fontSize={textSize}
          fontWeight="600"
          color="$color"
          textAlign="center"
        >
          Nenhuma foto ainda
        </Text>
        <Text
          fontSize={14}
          color="$color"
          opacity={0.6}
          textAlign="center"
          mt="$2"
        >
          Quando fotos e vídeos forem compartilhados, eles aparecerão aqui
        </Text>
      </YStack>
    );
  };

  return (
    <SimplifiedScreenWrapper>
      {/* Botão de atualizar para modo simplificado */}
      {settings.simplifiedNav && (
        <Button
          size="$5"
          onPress={onRefresh}
          mx="$4"
          mt="$4"
          icon={<RefreshCw size={20} />}
          bg="$secondary"
          color="white"
          height={56}
        >
          Atualizar
        </Button>
      )}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          !settings.simplifiedNav ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#F29131"
              colors={["#F29131"]}
            />
          ) : undefined
        }
        contentContainerStyle={{
          backgroundColor: "#FFFFFF",
          flexGrow: 1,
          paddingBottom: 100,
        }}
      />

      {/* Modal de visualização de imagem */}
      <Modal
        visible={!!selectedPost}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setSelectedPost(null)}
        >
          {selectedPost && (
            <YStack w="100%" h="80%" ai="center" jc="center" gap="$4">
              {(() => {
                const primaryMedia = selectedPost.mediaItems?.[0];
                const url = primaryMedia?.url;
                return url ? (
                  <RNImage
                    source={{ uri: url }}
                    style={{ width: "100%", height: "80%" }}
                    resizeMode="contain"
                  />
                ) : (
                  <YStack w="100%" h="80%" bg="$background" />
                );
              })()}
              <YStack px="$4" ai="center">
                {selectedPost.title && (
                  <Text
                    color="white"
                    fontSize={18}
                    fontWeight="600"
                    textAlign="center"
                  >
                    {selectedPost.title}
                  </Text>
                )}
                {selectedPost.description && (
                  <Text
                    color="white"
                    fontSize={14}
                    opacity={0.8}
                    textAlign="center"
                    mt="$2"
                  >
                    {selectedPost.description}
                  </Text>
                )}
              </YStack>
              <Text color="white" fontSize={14} opacity={0.6}>
                Toque para fechar
              </Text>
            </YStack>
          )}
        </Pressable>
      </Modal>
    </SimplifiedScreenWrapper>
  );
}
