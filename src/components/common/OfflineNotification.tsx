"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
} from "@chakra-ui/react";
import { checkNetworkStatus } from "@/lib/offlineMode";

export function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkConnection = async () => {
    setIsLoading(true);
    const isOnline = await checkNetworkStatus();
    setIsOffline(!isOnline);
    setIsLoading(false);
  };

  useEffect(() => {
    // Check when component mounts
    checkConnection();

    // Set up listeners for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set up interval to periodically check connection (only if browser doesn't support events)
    const interval = setInterval(checkConnection, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <Alert
      status="warning"
      variant="solid"
      position="fixed"
      bottom="0"
      width="100%"
      zIndex="999"
      borderRadius="0"
    >
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>You&apos;re offline</AlertTitle>
        <AlertDescription display="block">
          Limited functionality is available. Some data may be cached from your
          previous session.
        </AlertDescription>
      </Box>
      <Button
        onClick={checkConnection}
        size="sm"
        colorScheme="white"
        variant="outline"
        isLoading={isLoading}
        loadingText="Checking"
      >
        Check connection
      </Button>
    </Alert>
  );
}
