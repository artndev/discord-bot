import * as CONSTANTS from '@/src/constants';
import { Request, Response } from 'express';
import z from 'zod';
import { supabase } from '../db';
import { messageSchema, paramSchemas } from '../schemas';

export const updateHistory = async (req: Request, res: Response) => {
    try {
        const validation = messageSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: z.treeifyError(validation.error).errors,
                status: 400,
            });
        }
        const { channel_id, content, role } = validation.data;

        const { error: insertError } = await supabase.from('ai_chat_history').insert({ channel_id, content, role });
        if (insertError) {
            throw new Error(insertError.message);
        }

        const { count, error: selectError } = await supabase
            .from('ai_chat_history')
            .select('*', { count: 'exact', head: true })
            .eq('channel_id', channel_id);

        if (selectError) {
            throw new Error(selectError.message);
        }

        if (count && count > CONSTANTS.AI_CHAT_HISTORY_MAX_MESSAGES) {
            const { data: messagesToDelete } = await supabase
                .from('ai_chat_history')
                .select('id')
                .eq('channel_id', channel_id)
                .order('created_at', { ascending: true })
                .limit(count - CONSTANTS.AI_CHAT_HISTORY_MAX_MESSAGES);

            if (messagesToDelete && messagesToDelete.length > 0) {
                const { error: deleteError } = await supabase
                    .from('ai_chat_history')
                    .delete()
                    .in(
                        'id',
                        messagesToDelete.map((msg) => {
                            return msg.id;
                        }),
                    );

                if (deleteError) {
                    console.error('[aiChatHistoryController]', deleteError);
                }
            }
        }

        return res.status(200).json({ message: 'Success', status: 200 });
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Server is not responding...',
            status: 500,
        });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    try {
        const validation = paramSchemas.idSchema.safeParse(req.params.channel_id);
        if (!validation.success) {
            return res.status(400).json({
                message: z.treeifyError(validation.error).errors,
                status: 400,
            });
        }

        const channelId = validation.data;

        const { data, error } = await supabase
            .from('ai_chat_history')
            .select('*')
            .eq('channel_id', channelId)
            .order('created_at', { ascending: false })
            .limit(10);
        if (error) {
            throw new Error(error.message);
        }

        return res.status(200).json({
            message: 'Success',
            status: 200,
            history: data.map(({ role, content }) => ({
                role,
                content,
            })),
        });
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Server is not responding...',
            status: 500,
        });
    }
};
