import { NextResponse } from 'next/server';
import { languageService } from '../../../lib/languageService';
import { isSupportedLanguage } from '../../../i18n/languages';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { text, targetLang, sourceLang = 'en', preserveTerms = [] } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    if (!targetLang || !isSupportedLanguage(targetLang)) {
      return NextResponse.json({ error: 'Valid targetLang is required' }, { status: 400 });
    }

    const translatedText = await languageService.translate({
      text,
      targetLang,
      sourceLang,
      preserveTerms,
    });

    return NextResponse.json({
      success: true,
      originalText: text,
      translatedText,
      sourceLang,
      targetLang,
    });
  } catch (err) {
    console.error('Translation route error:', err);
    return NextResponse.json(
      { error: 'Translation processing failed', fallbackText: '' },
      { status: 500 }
    );
  }
}
