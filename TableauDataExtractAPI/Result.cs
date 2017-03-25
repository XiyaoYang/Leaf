//---------------------------------------------------------------------------//
// OWNER:   RAPID INSIGHT INC.                                               //
// AUTHOR:  SCOTT STEESY                                                     //
// DATE:    01/23/2013                                                       //
// PURPOSE: Create a enum to emulate the TAB_RESULT "named list" of constants//
//			in the Tableau Data Extract API.								 //
//---------------------------------------------------------------------------//

using System;
using API = Tableau.DataExtractAPI;

namespace Tableau
{
	public enum Result
	{
		Result_Success = 0,					// Successful function call
		Result_OutOfMemory = 12,			// ENOMEM
		Result_PermissionDenied = 13,		// EACCES
		Result_InvalidFile = 9,				// EBADF
		Result_FileExists = 17,				// EEXIST
		Result_TooManyFiles = 24,			// EMFILE
		Result_FileNotFound = 2,			// ENOENT
		Result_DiskFull = 28,				// ENOSPC
		Result_DirectoryNotEmpty = 41,		// ENOTEMPTY
		Result_NoSuchDatabase = 201,		// Data Engine errors start at 200.
		Result_QueryError = 202,			// 
		Result_NullArgument = 203,			// 
		Result_DataEngineError = 204,		// 
		Result_Cancelled = 205,				// 
		Result_BadIndex = 206,				// 
		Result_ProtocolError = 207,			// 
		Result_NetworkError = 208,			// 
		Result_InternalError = 300,			// 300+: other error codes
		Result_WrongType = 301,				// 
		Result_UsageError = 302,			// 
		Result_InvalidArgument = 303,		// 
		Result_BadHandle = 304,				// 
		Result_UnknownError = 999,			// 
	}

	/// <summary>
	/// Safely convert between C# enum and Data Extract's exported constants
	/// </summary>
	internal static partial class ConvertEnum
	{
		// STS - Never sent in ... so no need for this conversion
		//public static Int32 ToResult( Result tr )
		//{
		//    switch( tr )
		//    {
		//        case Result.Result_Success:
		//            return( API.TAB_RESULT_Success );
		//        case Result.Result_OutOfMemory:
		//            return( API.TAB_RESULT_OutOfMemory );
		//        case Result.Result_PermissionDenied:
		//            return( API.TAB_RESULT_PermissionDenied );
		//        case Result.Result_InvalidFile:
		//            return( API.TAB_RESULT_InvalidFile );
		//        case Result.Result_FileExists:
		//            return( API.TAB_RESULT_FileExists );
		//        case Result.Result_TooManyFiles:
		//            return( API.TAB_RESULT_TooManyFiles );
		//        case Result.Result_FileNotFound:
		//            return( API.TAB_RESULT_FileNotFound );
		//        case Result.Result_DiskFull:
		//            return( API.TAB_RESULT_DiskFull );
		//        case Result.Result_DirectoryNotEmpty:
		//            return( API.TAB_RESULT_DirectoryNotEmpty );
		//        case Result.Result_NoSuchDatabase:
		//            return( API.TAB_RESULT_NoSuchDatabase );
		//        case Result.Result_QueryError:
		//            return( API.TAB_RESULT_QueryError );
		//        case Result.Result_NullArgument:
		//            return( API.TAB_RESULT_NullArgument );
		//        case Result.Result_DataEngineError:
		//            return( API.TAB_RESULT_DataEngineError );
		//        case Result.Result_Cancelled:
		//            return( API.TAB_RESULT_Cancelled );
		//        case Result.Result_BadIndex:
		//            return( API.TAB_RESULT_BadIndex );
		//        case Result.Result_ProtocolError:
		//            return( API.TAB_RESULT_ProtocolError );
		//        case Result.Result_NetworkError:
		//            return( API.TAB_RESULT_NetworkError );
		//        case Result.Result_InternalError:
		//            return( API.TAB_RESULT_InternalError );
		//        case Result.Result_WrongType:
		//            return( API.TAB_RESULT_WrongType );
		//        case Result.Result_UsageError:
		//            return( API.TAB_RESULT_UsageError );
		//        case Result.Result_InvalidArgument:
		//            return( API.TAB_RESULT_InvalidArgument );
		//        case Result.Result_BadHandle:
		//            return( API.TAB_RESULT_BadHandle );
		//        case Result.Result_UnknownError:
		//            return ( API.TAB_RESULT_UnknownError );
		//    }
		//    throw new ArgumentOutOfRangeException( "Unrecognized Result" );
		//}

		public static Result FromResult( Int32 tr )
		{
			if( tr == API.TAB_RESULT_Success )
				return( Result.Result_Success );
			if( tr == API.TAB_RESULT_OutOfMemory )
				return( Result.Result_OutOfMemory );
			if( tr == API.TAB_RESULT_PermissionDenied )
				return( Result.Result_PermissionDenied );
			if( tr == API.TAB_RESULT_InvalidFile )
				return( Result.Result_InvalidFile );
			if( tr == API.TAB_RESULT_FileExists )
				return( Result.Result_FileExists );
			if( tr == API.TAB_RESULT_TooManyFiles )
				return( Result.Result_TooManyFiles );
			if( tr == API.TAB_RESULT_FileNotFound )
				return( Result.Result_FileNotFound );
			if( tr == API.TAB_RESULT_DiskFull )
				return( Result.Result_DiskFull );
			if( tr == API.TAB_RESULT_DirectoryNotEmpty )
				return( Result.Result_DirectoryNotEmpty );
			if( tr == API.TAB_RESULT_NoSuchDatabase )
				return( Result.Result_NoSuchDatabase );
			if( tr == API.TAB_RESULT_QueryError )
				return( Result.Result_QueryError );
			if( tr == API.TAB_RESULT_NullArgument )
				return( Result.Result_NullArgument );
			if( tr == API.TAB_RESULT_DataEngineError )
				return( Result.Result_DataEngineError );
			if( tr == API.TAB_RESULT_Cancelled )
				return( Result.Result_Cancelled );
			if( tr == API.TAB_RESULT_BadIndex )
				return( Result.Result_BadIndex );
			if( tr == API.TAB_RESULT_ProtocolError )
				return( Result.Result_ProtocolError );
			if( tr == API.TAB_RESULT_NetworkError )
				return( Result.Result_NetworkError );
			if( tr == API.TAB_RESULT_InternalError )
				return( Result.Result_InternalError );
			if( tr == API.TAB_RESULT_WrongType )
				return( Result.Result_WrongType );
			if( tr == API.TAB_RESULT_UsageError )
				return( Result.Result_UsageError );
			if( tr == API.TAB_RESULT_InvalidArgument )
				return( Result.Result_InvalidArgument );
			if( tr == API.TAB_RESULT_BadHandle )
				return( Result.Result_BadHandle );
			if( tr == API.TAB_RESULT_UnknownError )
				return ( Result.Result_UnknownError );
			throw new ArgumentOutOfRangeException( "Unrecognized TAB_RESULT" );
		}
	}
}

//---------------------------------------------------------------------------//
// EOF
