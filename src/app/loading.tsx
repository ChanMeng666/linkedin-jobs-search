"use client";

import { Flex, Text } from '@once-ui-system/core';
import { Spinner } from '@/components/common/Spinner';

export default function Loading() {
  return (
    <Flex fillWidth fillHeight horizontal="center" vertical="center" gap="16" paddingY="104">
      <Spinner size="l" />
      <Text variant="body-default-m" onBackground="neutral-weak">Loading...</Text>
    </Flex>
  );
}
