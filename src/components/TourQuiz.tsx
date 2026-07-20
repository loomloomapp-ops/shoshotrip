"use client";

import { useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { LeadForm } from "@/components/LeadForm";
import { Reveal } from "@/components/Reveal";
import { track } from "@/lib/analytics";
import { ArrowLeft, ArrowRight, Check } from "@/components/Icons";
import { quizScene } from "@/content/media";

export function TourQuiz({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const q = dict.quiz;
  const total = q.steps.length;

  // step: 0..total-1 = questions, total = contact form
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(total).fill(null));
  const [started, setStarted] = useState(false);

  const progress = Math.round(((step + (step === total ? 0 : 0)) / total) * 100);
  const answeredCurrent = step < total ? answers[step] !== null : true;

  const select = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = optionIndex;
      return next;
    });
    if (step === 0 && !started) {
      setStarted(true);
      track("quiz_start");
    }
    // auto-advance question steps after a short beat
    if (step < total - 1) {
      window.setTimeout(() => setStep((s) => Math.min(s + 1, total)), 240);
    } else {
      window.setTimeout(() => setStep(total), 240);
    }
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const goNext = () => {
    if (answeredCurrent) setStep((s) => Math.min(total, s + 1));
  };

  const quizAnswers = answers
    .map((a, i) => (a !== null ? q.steps[i].options[a] : null))
    .filter((v): v is string => v !== null);

  const isForm = step === total;

  return (
    <section className="section section--forest quiz-section" id="quiz">
      <div className="quiz-bg" aria-hidden="true">
        <Image
          src={quizScene}
          alt=""
          fill
          sizes="100vw"
          className="quiz-bg__img"
          priority={false}
        />
        <span className="quiz-bg__scrim" />
      </div>
      <div className="container quiz">
        <Reveal className="quiz__head">
          <span className="eyebrow eyebrow--light">{q.eyebrow}</span>
          <h2>{q.title}</h2>
          <p className="lead">{q.text}</p>
        </Reveal>

        <Reveal className="quiz__panel" delay={0.08}>
          {/* Progress */}
          <div className="quiz__progress" aria-hidden="true">
            <div
              className="quiz__progress-bar"
              style={{ width: `${isForm ? 100 : progress}%` }}
            />
          </div>
          <div className="quiz__steplabel">
            {isForm ? (
              <span>{q.final.title}</span>
            ) : (
              <span>
                {q.step} {step + 1} {q.of} {total}
              </span>
            )}
          </div>

          {!isForm ? (
            <div className="quiz__step" key={step}>
              <h3 className="quiz__question">{q.steps[step].question}</h3>
              <div className="quiz__options" role="radiogroup" aria-label={q.steps[step].question}>
                {q.steps[step].options.map((opt, i) => {
                  const selected = answers[step] === i;
                  return (
                    <button
                      key={opt}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`quiz__option${selected ? " is-selected" : ""}`}
                      onClick={() => select(i)}
                    >
                      <span className="quiz__option-mark">{selected && <Check width={14} height={14} />}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="quiz__controls">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={goBack}
                  disabled={step === 0}
                >
                  <span className="btn__icon"><ArrowLeft width={13} height={13} /></span>
                  {q.back}
                </button>
                <button
                  type="button"
                  className="btn btn--light btn--sm"
                  onClick={goNext}
                  disabled={!answeredCurrent}
                >
                  {q.next}
                  <span className="btn__icon"><ArrowRight width={13} height={13} /></span>
                </button>
              </div>
            </div>
          ) : (
            <div className="quiz__step quiz__form">
              <div className="quiz__form-head">
                <h3 className="quiz__question">{q.final.title}</h3>
                <p>{q.final.text}</p>
                <button type="button" className="link-arrow quiz__back-link" onClick={goBack}>
                  <ArrowLeft width={14} height={14} /> {q.back}
                </button>
              </div>
              <LeadForm
                locale={locale}
                source="quiz"
                submitLabel={q.final.submit}
                context={{ quizAnswers }}
                onSuccess={() => track("quiz_complete")}
              />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
