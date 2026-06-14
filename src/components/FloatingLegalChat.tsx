"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Send, Minimize2 } from "lucide-react";
import { ChatBotAvatar } from "@/components/ChatBotAvatar";
import {
  createMessageId,
  createWelcomeChatMessage,
  computeTypingDelay,
  getProactiveTeaser,
  processChatMessage,
  TEASER_MESSAGES,
  type ChatContext,
  type ChatMessage,
} from "@/lib/legalChatBot";
import type { LegalDiagnosticResult } from "@/lib/legalAIDiagnostic";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent/80 animate-pulse-soft"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

export function FloatingLegalChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createWelcomeChatMessage(),
  ]);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "Analizar mi caso",
    "Ver especialidades",
    "Contactar abogado",
    "¿Qué documentos necesito?",
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastDiagnostic, setLastDiagnostic] =
    useState<LegalDiagnosticResult | null>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [teaserText, setTeaserText] = useState(TEASER_MESSAGES[0]);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pageSecondsRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setShowTeaser(false);
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [open, messages, typing, scrollToBottom]);

  useEffect(() => {
    if (teaserDismissed || open) return;

    const initial = window.setTimeout(() => setShowTeaser(true), 3500);
    const tick = window.setInterval(() => {
      pageSecondsRef.current += 1;
      setTeaserText(getProactiveTeaser(pageSecondsRef.current));
    }, 8000);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(tick);
    };
  }, [teaserDismissed, open]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      const userMsg: ChatMessage = {
        id: createMessageId(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setQuickReplies([]);
      setTyping(true);
      setShowTeaser(false);
      setTeaserDismissed(true);

      const nextCount = messageCount + 1;
      setMessageCount(nextCount);

      const context: ChatContext = {
        lastDiagnostic,
        messageCount: nextCount,
      };
      const reply = processChatMessage(trimmed, context);
      const delay = computeTypingDelay(reply.content);

      window.setTimeout(() => {
        if (reply.diagnostic) {
          setLastDiagnostic(reply.diagnostic);
        }

        if (reply.navigateTo) {
          window.location.hash = reply.navigateTo;
        }

        const botMsg: ChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content: reply.content,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, botMsg]);
        setQuickReplies(reply.quickReplies);
        setTyping(false);

        if (!open) setHasUnread(true);
      }, delay);
    },
    [typing, lastDiagnostic, messageCount, open]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const openChat = () => {
    setOpen(true);
    setShowTeaser(false);
    setTeaserDismissed(true);
  };

  const dismissTeaser = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTeaser(false);
    setTeaserDismissed(true);
  };

  return (
    <>
      {/* Panel de chat */}
      <div
        className={`fixed bottom-[5.5rem] right-4 z-50 flex w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-white/12 bg-graphite/97 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-300 sm:right-6 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
        style={{ maxHeight: "min(580px, calc(100svh - 6.5rem))" }}
        role="dialog"
        aria-label="Asistente legal Salfate Abogados"
        aria-hidden={!open}
      >
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-petrol-200/90 to-petrol-100/80 px-4 py-3">
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl"
            aria-hidden
          />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChatBotAvatar size="sm" active />
              <div>
                <p className="text-sm font-semibold text-ink">
                  Asistente Salfate
                </p>
                <p className="flex items-center gap-1.5 text-xs text-emerald-300/90">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  En línea · responde al instante
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted transition hover:bg-white/10 hover:text-ink"
                aria-label="Minimizar chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted transition hover:bg-white/10 hover:text-ink"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={listRef}
          className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          style={{ minHeight: 300, maxHeight: 380 }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <ChatBotAvatar size="sm" className="mt-1 self-end" />
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "rounded-br-md bg-accent text-petrol-300"
                    : "rounded-bl-md border border-white/10 bg-white/[0.06] text-ink"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-2 justify-start" role="status" aria-live="polite">
              <ChatBotAvatar size="sm" className="self-end" active />
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-muted">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>

        {quickReplies.length > 0 && !typing && (
          <div className="flex flex-wrap gap-2 border-t border-white/5 px-4 py-2.5">
            {quickReplies.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => sendMessage(label)}
                className="rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent-soft transition hover:border-accent/50 hover:bg-accent/20"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-white/10 bg-petrol-200/50 p-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escriba su consulta…"
            disabled={typing}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-60"
            aria-label="Mensaje para el asistente"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-petrol-300 transition hover:bg-accent-soft disabled:opacity-50"
            aria-label="Enviar mensaje"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Notificación proactiva */}
      {showTeaser && !open && !teaserDismissed && (
        <div
          className="fixed bottom-[5.25rem] right-4 z-50 max-w-[260px] animate-teaser-in sm:right-6"
          role="status"
        >
          <div className="relative rounded-2xl border border-accent/30 bg-graphite/95 shadow-xl shadow-black/40 backdrop-blur-xl">
            <button
              type="button"
              onClick={dismissTeaser}
              className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-petrol-200 text-muted transition hover:text-ink"
              aria-label="Cerrar notificación"
            >
              <X className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={openChat}
              className="group w-full px-4 py-3 text-left transition hover:border-accent/50"
            >
              <p className="text-xs font-medium text-accent-soft">
                Asistente Salfate
              </p>
              <p className="mt-1 text-sm leading-snug text-ink">{teaserText}</p>
              <p className="mt-2 text-xs text-muted transition group-hover:text-accent-soft">
                Toca para conversar →
              </p>
            </button>
          </div>
          <div
            className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 border-b border-r border-accent/30 bg-graphite/95"
            aria-hidden
          />
        </div>
      )}

      {/* Launcher con robot */}
      <div
        className="fixed bottom-5 right-4 z-50 sm:right-6"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!open && (
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-accent/30 animate-ping"
            aria-hidden
          />
        )}
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openChat())}
          className={`group relative flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border-2 border-accent/50 bg-gradient-to-br from-petrol-100 to-petrol-300 shadow-[0_8px_32px_rgba(201,169,98,0.35)] transition duration-300 hover:scale-105 hover:border-accent active:scale-95 ${
            open ? "scale-95 border-white/20" : ""
          }`}
          aria-label={open ? "Cerrar asistente legal" : "Abrir asistente legal"}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-6 w-6 text-accent" />
          ) : (
            <>
              <ChatBotAvatar size="lg" active={hovered || showTeaser} />
              {hasUnread && (
                <span className="absolute right-2 top-2 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-400 ring-2 ring-petrol-300" />
                </span>
              )}
            </>
          )}
        </button>
        {!open && hovered && !showTeaser && (
          <span className="pointer-events-none absolute -left-2 top-1/2 hidden -translate-x-full -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-graphite/95 px-3 py-1.5 text-xs text-ink shadow-lg sm:block">
            ¿Necesita orientación legal?
          </span>
        )}
      </div>
    </>
  );
}
