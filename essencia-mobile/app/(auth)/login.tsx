import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { Button, Input, Spinner, Text, YStack } from "tamagui";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setSubmitting(true);
      await login(data);
    } catch (error: any) {
      Alert.alert(
        "Erro no Login",
        error.response?.data?.message || "Credenciais inválidas"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  return (
    <YStack f={1} jc="center" ai="center" p="$4" bg="$background">
      <Text fontSize="$10" fontWeight="bold" color="$color" mb="$2">
        Essência Feliz
      </Text>
      <Text fontSize="$5" color="$color" mb="$8" opacity={0.7}>
        Bem-vindo! Faça login para continuar.
      </Text>

      <YStack w="100%" gap="$3">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <YStack gap="$2">
              <Input
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                borderColor={errors.email ? "$error" : "$borderColor"}
                height={48}
              />
              {errors.email && (
                <Text color="$error" fontSize="$2">
                  {errors.email.message}
                </Text>
              )}
            </YStack>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <YStack gap="$2">
              <Input
                placeholder="Senha"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoCapitalize="none"
                borderColor={errors.password ? "$error" : "$borderColor"}
                height={48}
              />
              {errors.password && (
                <Text color="$error" fontSize="$2">
                  {errors.password.message}
                </Text>
              )}
            </YStack>
          )}
        />

        <Button
          bg="$primary"
          color="white"
          onPress={handleSubmit(onSubmit)}
          disabled={submitting}
          mt="$2"
          height={56}
        >
          {submitting ? <Spinner color="white" /> : "Entrar"}
        </Button>
      </YStack>
    </YStack>
  );
}
