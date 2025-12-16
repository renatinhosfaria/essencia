import { SimplifiedScreenWrapper } from "@/components/SimplifiedScreenWrapper";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useScaledFont } from "@/hooks/useScaledFont";
import { Eye, Navigation, Type } from "@tamagui/lucide-icons";
import { ScrollView, Switch, Text, XStack, YStack } from "tamagui";

export default function AccessibilityScreen() {
  const {
    settings,
    toggleLargeFontMode,
    toggleHighContrastMode,
    toggleSimplifiedNav,
    fontScale,
  } = useAccessibility();

  const titleSize = useScaledFont(8);
  const cardTitleSize = useScaledFont(5);
  const descriptionSize = useScaledFont(3);
  const infoSize = useScaledFont(2);

  return (
    <SimplifiedScreenWrapper>
      <ScrollView bg="$background" flex={1}>
        <YStack p="$4" gap="$4">
          <Text fontSize={titleSize} fontWeight="bold" color="$color">
            Acessibilidade
          </Text>

          {/* Large Font Mode */}
          <YStack
            bg="white"
            p="$4"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
            gap="$3"
          >
            <XStack ai="center" jc="space-between">
              <XStack ai="center" gap="$3" f={1}>
                <Type size={24} color="$primary" />
                <YStack f={1}>
                  <Text
                    fontSize={cardTitleSize}
                    fontWeight="600"
                    color="$color"
                  >
                    Fonte Grande
                  </Text>
                  <Text fontSize={descriptionSize} color="$placeholder">
                    Aumenta o tamanho do texto para {fontScale}x
                  </Text>
                </YStack>
              </XStack>
              <Switch
                size="$4"
                checked={settings.largeFontMode}
                onCheckedChange={toggleLargeFontMode}
              >
                <Switch.Thumb animation="quick" />
              </Switch>
            </XStack>
            {settings.largeFontMode && (
              <YStack bg="$secondaryBackground" p="$3" borderRadius="$3">
                <Text fontSize={infoSize} color="$placeholder">
                  ✓ Texto ampliado está ativo. Todas as fontes estão em{" "}
                  {fontScale}x do tamanho normal.
                </Text>
              </YStack>
            )}
          </YStack>

          {/* High Contrast Mode */}
          <YStack
            bg="white"
            p="$4"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
            gap="$3"
          >
            <XStack ai="center" jc="space-between">
              <XStack ai="center" gap="$3" f={1}>
                <Eye size={24} color="$primary" />
                <YStack f={1}>
                  <Text
                    fontSize={cardTitleSize}
                    fontWeight="600"
                    color="$color"
                  >
                    Alto Contraste
                  </Text>
                  <Text fontSize={descriptionSize} color="$placeholder">
                    Cores mais vivas para melhor distinção
                  </Text>
                </YStack>
              </XStack>
              <Switch
                size="$4"
                checked={settings.highContrastMode}
                onCheckedChange={toggleHighContrastMode}
              >
                <Switch.Thumb animation="quick" />
              </Switch>
            </XStack>
            {settings.highContrastMode && (
              <YStack bg="$secondaryBackground" p="$3" borderRadius="$3">
                <Text fontSize={infoSize} color="$placeholder">
                  ✓ Modo alto contraste ativo. Cores seguem padrão WCAG AA com
                  contraste mínimo de 4.5:1.
                </Text>
              </YStack>
            )}
          </YStack>

          {/* Simplified Navigation */}
          <YStack
            bg="white"
            p="$4"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
            gap="$3"
          >
            <XStack ai="center" jc="space-between">
              <XStack ai="center" gap="$3" f={1}>
                <Navigation size={24} color="$primary" />
                <YStack f={1}>
                  <Text
                    fontSize={cardTitleSize}
                    fontWeight="600"
                    color="$color"
                  >
                    Navegação Simplificada
                  </Text>
                  <Text fontSize={descriptionSize} color="$placeholder">
                    Botões maiores e menos opções na tela
                  </Text>
                </YStack>
              </XStack>
              <Switch
                size="$4"
                checked={settings.simplifiedNav}
                onCheckedChange={toggleSimplifiedNav}
              >
                <Switch.Thumb animation="quick" />
              </Switch>
            </XStack>
            {settings.simplifiedNav && (
              <YStack bg="$secondaryBackground" p="$3" borderRadius="$3">
                <Text fontSize={infoSize} color="$placeholder">
                  ✓ Navegação simplificada ativa. Botão Voltar e Início sempre
                  visíveis. Gestos de deslize desabilitados.
                </Text>
              </YStack>
            )}
          </YStack>

          <Text fontSize={infoSize} color="$placeholder" ta="center" mt="$4">
            As configurações são salvas automaticamente e aplicadas em todo o
            aplicativo.
          </Text>
        </YStack>
      </ScrollView>
    </SimplifiedScreenWrapper>
  );
}
