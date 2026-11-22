"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Invitation as InvitationRow, TemplateId, Wish } from "@/lib/types";
import { ToastProvider } from "@/components/ui/Toast";
import { CoverGate } from "./CoverGate";
import { MusicPlayer } from "./MusicPlayer";
import { WeddingTemplateEngine, getTemplateTheme } from "./template-engine";

export function Invitation({
  invitation,
  wishes,
  guestName,
  previewTemplate,
}: {
  invitation: InvitationRow;
  wishes: Wish[];
  guestName?: string;
  previewTemplate?: string;
}) {
  const [opened, setOpened] = useState(false);
  const templateId: TemplateId =
    previewTemplate === "classic-luxury" ? "classic-luxury" : invitation.active_template;

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const activeTheme = getTemplateTheme(templateId);

  return (
    <ToastProvider>
      <AnimatePresence mode="wait">
        {opened ? (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <WeddingTemplateEngine
              invitation={invitation}
              wishes={wishes}
              guestName={guestName}
              theme={activeTheme}
            />
          </motion.div>
        ) : (
          <CoverGate
            key="cover"
            content={invitation.content}
            theme={activeTheme}
            guestName={guestName}
            onOpen={() => setOpened(true)}
          />
        )}
      </AnimatePresence>
      <MusicPlayer src={invitation.active_music_url} shouldPlay={opened} />
    </ToastProvider>
  );
}
