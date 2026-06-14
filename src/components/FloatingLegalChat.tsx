"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  Minimize2,
} from "lucide-react";
import {
  createMessageId,
  createWelcomeChatMessage,
  processChatMessage,
  type ChatContext,
  type ChatMessage,
} from "@/lib/legalChatBot";
import type { LegalDiagnosticResult } from "@/lib/legalAIDiagnostic";

const TYPING_MS = 600;

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
  const [lastDiagnostic, setLastDiagnostic] =
    useState<LegalDiagnosticResult | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [open, messages, typing, scrollToBottom]);

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

      window.setTimeout(() => {
        const context: ChatContext = { lastDiagnostic };
        const reply = processChatMessage(trimmed, context);

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
      }, TYPING_MS);
    },
    [typing, lastDiagnostic, open]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleOpen = () => setOpen((v) => !v);

  return (
    <>
      {/* Panel de chat */}
      <div
        className={`fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-graphite/95 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-300 sm:right-6 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ maxHeight: "min(560px, calc(100svh - 7rem))" }}
        role="dialog"
        aria-label="Asistente legal Salfate Abogados"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-petrol-200/80 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                Asistente Salfate
              </p>
              <p className="text-xs text-muted">Orientación legal inicial</p>
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

        {/* Mensajes */}
        <div
          ref={listRef}
          className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          style={{ minHeight: 280, maxHeight: 360 }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "rounded-br-md bg-accent text-petrol-300"
                    : "rounded-bl-md border border-white/10 bg-white/5 text-ink"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start" role="status" aria-live="polite">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                Escribiendo…
              </div>
            </div>
          )}
        </div>

        {/* Quick replies */}
        {quickReplies.length > 0 && !typing && (
          <div className="flex flex-wrap gap-2 border-t border-white/5 px-4 py-2">
            {quickReplies.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => sendMessage(label)}
                className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-soft transition hover:bg-accent/20"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
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

      {/* Burbuja flotante */}
      <button
        type="button"
        onClick={toggleOpen}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-petrol-300 shadow-lg shadow-black/40 transition hover:bg-accent-soft hover:scale-105 active:scale-95 sm:right-6"
        aria-label={open ? "Cerrar asistente legal" : "Abrir asistente legal"}
        aria-expanded={open}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {hasUnread && (
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-graphite" />
            )}
          </>
        )}
      </button>
    </>
  );
}
